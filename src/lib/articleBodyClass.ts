/**
 * Gemensam typografi för artikeltext, både kodade artiklar och artiklar som
 * redaktionen laddat upp från Word (samma utseende i förhandsvisning och publikt).
 */
export const ARTICLE_BODY_CLASS = `
  article-body max-w-none
  text-base md:text-lg leading-relaxed text-foreground/90
  [&_p]:mb-5 [&_p]:leading-relaxed
  [&_h2]:font-bold [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-balance
  [&_h3]:font-semibold [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:text-foreground [&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:text-balance
  [&_h4]:font-semibold [&_h4]:text-lg [&_h4]:text-foreground [&_h4]:mt-7 [&_h4]:mb-2
  [&_ul]:my-6 [&_ul]:pl-7 [&_ul]:space-y-2 [&_ul>li]:list-disc [&_ul>li]:marker:text-primary [&_ul>li]:pl-2
  [&_ol]:my-6 [&_ol]:pl-7 [&_ol]:space-y-2 [&_ol>li]:list-decimal
  [&_li>p]:mb-0
  [&_strong]:text-foreground [&_strong]:font-semibold
  [&_em]:italic
  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80
  [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-lg md:[&_blockquote]:text-xl [&_blockquote]:text-foreground [&_blockquote_p]:mb-0
  [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded
  [&_figure]:my-8 [&_figure_img]:my-0 [&_figure_img]:w-full
  [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-muted-foreground
  [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base
  [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-3 [&_th]:text-left [&_th]:align-top
  [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:align-top [&_td_img]:my-0 [&_td_img]:mb-3 [&_td_p]:mb-2
  [&_hr]:my-10 [&_hr]:border-border
`;
