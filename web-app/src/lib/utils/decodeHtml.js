export const decodeHtml = (html) => {
  if (typeof window === "undefined" || !html) return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
