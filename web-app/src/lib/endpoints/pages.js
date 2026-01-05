export async function getPagesBySlug(slug) {
  const baseWp = process.env.NEXT_PUBLIC_WP_API_URL;

  const response = await fetch(`${baseWp}/pages?_embed&slug=${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ads: ${response.statusText}`);
  }
  return await response.json();
}
