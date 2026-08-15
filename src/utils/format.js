export function formatNaira(kobo) {
  const value = typeof kobo === "number" ? kobo : 0;
  return "\u20a6" + value.toLocaleString("en-NG");
}

export function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
