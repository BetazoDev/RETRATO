/**
 * WordPress GraphQL client for the RETRATO headless frontend.
 * All server-side data fetching goes through this module.
 */

const GRAPHQL_ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://retratowp.halonso.digital/graphql';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

/**
 * Execute a GraphQL query against the WordPress WPGraphQL endpoint.
 *
 * @param query     - The GraphQL query string.
 * @param variables - Optional variables object.
 * @param options   - Optional fetch options (revalidate, tags, etc.)
 */
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number | false; tags?: string[] }
): Promise<T> {
  const { revalidate = 60, tags } = options || {};

  const fetchOptions: RequestInit & { next?: Record<string, unknown> } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };

  // Configure ISR / caching
  if (process.env.NODE_ENV === 'development') {
    fetchOptions.next = { revalidate: 0 };
  } else if (revalidate !== false) {
    fetchOptions.next = { revalidate, ...(tags ? { tags } : {}) };
  } else if (tags) {
    fetchOptions.next = { tags };
  }

  const response = await fetch(GRAPHQL_ENDPOINT, fetchOptions);

  if (!response.ok) {
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    console.error('[GraphQL Errors]', JSON.stringify(json.errors, null, 2));
    throw new Error(
      `GraphQL Error: ${json.errors.map((e) => e.message).join(', ')}`
    );
  }

  return json.data;
}
