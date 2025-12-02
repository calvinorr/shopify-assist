const API_VERSION = "2024-10"; // Shopify quarterly version

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function makeShopifyRequest(
  query: string,
  variables?: Record<string, unknown>
): Promise<Response> {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

  if (!accessToken) {
    throw new Error("SHOPIFY_ACCESS_TOKEN is not configured");
  }

  if (!storeDomain) {
    throw new Error("SHOPIFY_STORE_DOMAIN is not configured");
  }

  const url = `https://${storeDomain}/admin/api/${API_VERSION}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  // Handle rate limiting with retry
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return makeShopifyRequest(query, variables);
  }

  return response;
}

export async function shopifyGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await makeShopifyRequest(query, variables);

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json: ShopifyGraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  if (!json.data) {
    throw new Error("No data returned from Shopify");
  }

  return json.data;
}
