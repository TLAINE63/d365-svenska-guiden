import { describe, it, expect } from "vitest";
import { splitArticleVideos } from "../articleVideoEmbeds";

describe("splitArticleVideos", () => {
  it("bäddar in ett stycke som bara är en YouTube-länk", () => {
    const parts = splitArticleVideos('<h2>Fråga</h2><p><a href="https://youtu.be/DitMX0anlh0?si=x">https://youtu.be/DitMX0anlh0</a></p><p>Text</p>');
    expect(parts.map((p) => p.type)).toEqual(["html", "video", "html"]);
    expect(parts[1]).toEqual({ type: "video", id: "DitMX0anlh0" });
  });

  it("lämnar YouTube-länkar i löpande text orörda", () => {
    const html = '<p>Se <a href="https://youtu.be/DitMX0anlh0">samtalet</a> här.</p>';
    expect(splitArticleVideos(html)).toEqual([{ type: "html", html }]);
  });
});
