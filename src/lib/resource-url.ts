export function getResourceUrl(path: string): string {
  // Vite's static server needs valid path punctuation, such as commas, left literal.
  const encodedPath = encodeURI(path).replace(/[?#]/g, encodeURIComponent);
  return `${import.meta.env.BASE_URL}resources/${encodedPath}`;
}
