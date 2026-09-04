---
name: Ärliga besökssiffror i rapporter
description: Rapporter ska använda distinkta anonymiserade IP:n som "unika besökare", inte sessioner; aug 2026 = 326 IP, 609 sessioner; buyer_tool_events-loggning kräver publicering
type: feature
---
I månadsrapporter (både verifierad och basic) ska "unika besökare" = distinkta anonymiserade IP-adresser i visitor_analytics, INTE sessioner. Aug 2026: 326 unika IP, 609 sessioner, 1 464 sidvisningar. Juni–juli 2026 har misstänkt spårningslucka (66/34 IP) – formulera tillväxt försiktigt. buyer_tool_events-spårning (behovsanalys/kravspec/jämförelse) måste vara publicerad för att samla data; efterfrågeavsnittet renderas först vid ≥10 körningar en hel period.
