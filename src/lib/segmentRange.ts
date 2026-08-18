/**
 * Segmentval (antal anställda / omsättning) ska vara max 3 alternativ
 * som ligger i rad efter varandra i listan.
 * Returnerar nästa urval, eller ett felmeddelande om valet inte är tillåtet.
 */
export const toggleContiguousRange = (
  options: string[],
  current: string[],
  value: string,
): { next: string[] } | { error: string } => {
  const idx = options.indexOf(value);
  const selectedIdx = current
    .map((v) => options.indexOf(v))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);

  if (selectedIdx.includes(idx)) {
    const isEdge = idx === selectedIdx[0] || idx === selectedIdx[selectedIdx.length - 1];
    if (!isEdge) {
      return { error: "Ta bort från början eller slutet – valen måste ligga i rad." };
    }
    return { next: current.filter((v) => v !== value) };
  }

  if (selectedIdx.length >= 3) {
    return { error: "Max 3 val – ta bort ett val först." };
  }
  if (selectedIdx.length > 0) {
    const min = selectedIdx[0];
    const max = selectedIdx[selectedIdx.length - 1];
    if (idx !== min - 1 && idx !== max + 1) {
      return { error: "Valen måste ligga i rad efter varandra." };
    }
  }
  return { next: [...current, value] };
};
