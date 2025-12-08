const API_VERSION = "2024-10"; // Shopify quarterly version
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 2000; // 2 seconds

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

  // Iterative retry with exponential backoff
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    // Success or non-retryable error
    if (response.status !== 429) {
      return response;
    }

    // Rate limited - check if we can retry
    if (attempt === MAX_RETRIES) {
      console.error(`Shopify rate limit: max retries (${MAX_RETRIES}) exceeded`);
      return response; // Return 429 response, let caller handle it
    }

    // Calculate wait time with exponential backoff + jitter
    const retryAfter = response.headers.get("Retry-After");
    const baseWait = retryAfter ? parseInt(retryAfter, 10) * 1000 : BASE_RETRY_DELAY;
    const jitter = Math.random() * 1000; // 0-1 second jitter
    const waitTime = baseWait * Math.pow(2, attempt) + jitter;

    console.warn(`Shopify rate limited. Retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(waitTime)}ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  // TypeScript safety - should never reach here
  throw new Error("Unexpected retry loop exit");
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
