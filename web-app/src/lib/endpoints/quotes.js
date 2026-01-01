export async function getQuotes(page) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/quote?per_page=10&page=${page.page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the response JSON
    const data = await response.json();

    return {
      data, // Array of posts
      total: response.headers.get("x-wp-total"), // Total number of posts
      totalPages: response.headers.get("x-wp-totalpages"), // Total number of pages
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}

export async function getQuoteBySlug(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/quote?_embed&slug=${slug}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
}

export async function submitQuoteResponse({
  postId,
  name,
  phone,
  email,
  details,
  quoteEmail,
}) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;
  try {
    const response = await fetch(`${baseWp}/quotes/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postId,
        name,
        phone,
        email,
        details,
        quote_email: quoteEmail,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function incrementQuoteView(quoteId) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;
  try {
    const response = await fetch(`${baseWp}/quotes/${quoteId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createQuote(quoteData) {
  const baseWp = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;

  try {
    // Determine if we have files to upload
    const hasFiles = quoteData instanceof FormData;

    let body;
    let headers = {};

    if (hasFiles) {
      // If FormData is provided, use it directly (for file uploads)
      body = quoteData;
      // Don't set Content-Type for FormData, let browser set it with boundary
    } else {
      // If regular object, send as JSON
      body = JSON.stringify(quoteData);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseWp}/quotes`, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to create quote: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
}
