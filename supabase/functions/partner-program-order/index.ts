import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';
import { verifyAdminJWT } from '../_shared/isvAuth.ts';
import { isFreeEmailDomain } from '../_shared/freeEmailDomains.ts';
import { orderPrice, orderValidation, orderSnapshot, ORDER_VERSION, ORDER_AREAS, type OrderSelection } from '../_shared/partnerOrder.ts';
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts';
const field = (n:number) => z.string().trim().min(2).max(n);
const email = z.string().trim().email().max(255).refine(v => !isFreeEmailDomain(v));
const schema = z.object({ request_id:z.string().uuid(), company:field(200), organization_number:z.string().regex(/^\d{6}-?\d{4}$/), contact_name:field(100), email, invoice_email:email, invoice_address:field(500), selection:z.object({level:z.enum(['basic','premium']),period:z.enum(['month','year']),areas:z.array(z.enum(['bc','fscm','crm'])).min(1).max(3),mediation:z.boolean(),start_date:z.string()}), accept:z.literal(true), authority:z.literal(true), mediation_accept:z.boolean(), honeypot:z.string().max(0).optional() });
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 if(req.method!=='POST')return response({error:'Metoden stöds inte.'},405);
 try{
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); const url=Deno.env.get('SUPABASE_URL');
  if(!key||!url)return response({error:'Beställning är tillfälligt otillgänglig.'},503);
  const db=createClient(url,key); const body=await req.json();
  if(body.action==='list'){
   if(!(await verifyAdminJWT(String(body.token||''),key,['admin','editor'])))return response({error:'Åtkomst saknas.'},401);
   const {data,error}=await db.from('partner_program_orders').select('*').order('created_at',{ascending:false}).limit(100);
   if(error)throw error;return response({orders:data});
  }
  const parsed=schema.safeParse(body);if(!parsed.success)return response({error:'Kontrollera företagsuppgifter, e-post och avtalsaccept.'},400);
  const d=parsed.data;const selection=d.selection as OrderSelection;
  const invalid=orderValidation(selection,d.accept,d.authority,d.mediation_accept);if(invalid)return response({error:invalid},400);
  const {data:prior}=await db.from('partner_program_orders').select('id,email,selection,company,contact_name,price_ex_vat,terms_snapshot').eq('request_id',d.request_id).maybeSingle();
  const sameSelection = prior && prior.selection.level===selection.level && prior.selection.period===selection.period && prior.selection.start_date===selection.start_date && prior.selection.mediation===selection.mediation && JSON.stringify(prior.selection.areas)===JSON.stringify(selection.areas);
  if(prior && (prior.email!==d.email.toLowerCase() || !sameSelection || prior.company!==d.company || prior.contact_name!==d.contact_name))return response({error:'Beställningen har redan sparats med andra uppgifter. Ändra inte en redan skickad beställning.'},409);
  if(!prior){
   const {count,error:countError}=await db.from('partner_program_orders').select('id',{count:'exact',head:true}).eq('email',d.email.toLowerCase()).gte('created_at',new Date(Date.now()-86400000).toISOString());
   if(countError)throw countError;if((count??0)>=3)return response({error:'För många beställningar. Kontakta oss för hjälp.'},429);
  }
  let row=prior;
  if(!row){
   const {data,error}=await db.from('partner_program_orders').insert({request_id:d.request_id,company:d.company,organization_number:d.organization_number,contact_name:d.contact_name,email:d.email.toLowerCase(),invoice_email:d.invoice_email.toLowerCase(),invoice_address:d.invoice_address,selection,price_ex_vat:orderPrice(selection),terms_version:ORDER_VERSION,terms_snapshot:{...orderSnapshot(selection),accept:true,authority:true,mediation_accept:d.mediation_accept}}).select('id,email,selection,company,contact_name,price_ex_vat,terms_snapshot').single();
   if(error)throw error;row=data;
  }
  if(!row)throw new Error('No order');
  let notified=false;
  try{
   const result=await sendTemplateEmail('partner-order','thomas.laine@dynamicfactory.se',{idempotencyKey:`partner-order-${row.id}`,replyTo:'thomas.laine@dynamicfactory.se',templateData:{company:row.company,orderId:row.id,summary:`${selection.level==='premium'?'Premium':'Grundprofil'} · ${selection.areas.map(a=>ORDER_AREAS[a]??a).join(', ')}\n${row.price_ex_vat} kr exklusive moms / ${selection.period==='year'?'år':'månad'}\nÖnskad start: ${selection.start_date}\nFörmedlingsavtal (Finder’s fee): ${selection.mediation?'Ja':'Nej'}`,contact:`${d.contact_name}, ${d.email}\nOrg.nr ${d.organization_number}\nFaktura: ${d.invoice_email}\n${d.invoice_address}`,terms:JSON.stringify(row.terms_snapshot)}});notified=result.sent;
  }catch{console.error('partner order notification failed');}
  return response({success:true,order_id:row.id,notified});
 }catch{console.error('partner order failed');return response({error:'Beställningen kunde inte sparas. Försök igen med samma beställning.'},500);}
});
