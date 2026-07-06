import { defineMcp } from "@lovable.dev/mcp-js";
import searchPartnersTool from "./tools/search-partners";
import getPartnerTool from "./tools/get-partner";
import listKnowledgeArticlesTool from "./tools/list-knowledge-articles";

export default defineMcp({
  name: "d365-guide-mcp",
  title: "D365 Guide MCP",
  version: "0.1.0",
  instructions:
    "Verktyg för d365.se – Svenska guiden till Microsoft Dynamics 365. Använd 'search_partners' för att hitta certifierade svenska D365-implementeringspartners filtrerat på applikation, bransch och geografi. Använd 'get_partner' för att hämta en enskild partnerprofil via slug. Använd 'list_knowledge_articles' för att hitta publicerade artiklar i kunskapscentret. All data är publik och köparsidig – följ TAYA-principen om radikal transparens.",
  tools: [searchPartnersTool, getPartnerTool, listKnowledgeArticlesTool],
});
