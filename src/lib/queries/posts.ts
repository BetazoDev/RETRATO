import { fetchGraphQL } from '../wordpress';
import type {
  HomepageData,
  SinglePostData,
  ArchiveData,
  SearchData,
  Post,
  Category,
} from '../types';

// ─── Homepage Posts ───

const GET_HOMEPAGE_POSTS = `
  query GetHomepagePosts {
    posts(first: 50) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
        postExtended {
          subtitle
          readingTime
          featuredLabel
          isFeatured
        }
      }
    }
  }
`;

export async function getHomepagePosts(): Promise<HomepageData> {
  try {
    interface RawHomepageData {
      posts: {
        nodes: Post[];
      };
    }

    const data = await fetchGraphQL<RawHomepageData>(GET_HOMEPAGE_POSTS, undefined, {
      revalidate: 60,
      tags: ['posts'],
    });

    const allPosts = data.posts.nodes || [];
    const featured = allPosts.filter((post) => post.postExtended?.isFeatured === true);

    return {
      featuredPosts: {
        nodes: featured,
      },
      latestPosts: {
        nodes: allPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching homepage posts:', error);
    return {
      featuredPosts: { nodes: [] },
      latestPosts: { nodes: [] },
    };
  }
}

// ─── Single Post by Slug ───

const GET_POST = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
          description
        }
      }
      postExtended {
        subtitle
        readingTime
        featuredLabel
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
        authorPhoto {
          node {
            sourceUrl
            altText
          }
        }
        isFeatured
        pullQuote
        technicalSheet {
          camera
          lens
          filmStock
          year
          location
        }
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        schema {
          raw
        }
      }
    }
  }
`;

export async function getPost(slug: string) {
  try {
    const data = await fetchGraphQL<SinglePostData>(GET_POST, { slug }, {
      revalidate: 60,
      tags: ['posts', `post-${slug}`],
    });
    return data.post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

// ─── All Post Slugs (for generateStaticParams) ───

const GET_ALL_POST_SLUGS = `
  query GetAllPostSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: { slug: string }[] } }>(
      GET_ALL_POST_SLUGS,
      undefined,
      { revalidate: 300 }
    );
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching all post slugs:', error);
    return [];
  }
}

// ─── Archive Posts (Paginated) ───

const GET_ARCHIVE_POSTS = `
  query GetArchivePosts($first: Int!, $after: String, $categorySlug: String, $tagSlug: String) {
    posts(first: $first, after: $after, where: { categoryName: $categorySlug, tag: $tagSlug }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
        postExtended {
          readingTime
          featuredLabel
        }
      }
    }
  }
`;

export async function getArchivePosts(
  first = 12,
  after?: string,
  categorySlug?: string,
  tagSlug?: string
) {
  try {
    return await fetchGraphQL<ArchiveData>(
      GET_ARCHIVE_POSTS,
      { first, after, categorySlug, tagSlug },
      { revalidate: 120, tags: ['posts'] }
    );
  } catch (error) {
    console.error('Error fetching archive posts:', error);
    return {
      posts: {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          endCursor: null,
          startCursor: null,
        },
        nodes: [],
      },
    };
  }
}

// ─── Search Posts ───

const SEARCH_POSTS = `
  query SearchPosts($search: String!) {
    posts(where: { search: $search }, first: 20) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export async function searchPosts(search: string) {
  try {
    const data = await fetchGraphQL<SearchData>(
      SEARCH_POSTS,
      { search },
      { revalidate: false }
    );
    return data.posts.nodes;
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// ─── Related Posts (same category, excluding current) ───

const GET_RELATED_POSTS = `
  query GetRelatedPosts($categorySlug: String!, $excludeId: ID!) {
    posts(
      first: 3
      where: {
        categoryName: $categorySlug
        notIn: [$excludeId]
      }
    ) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
        postExtended {
          readingTime
        }
      }
    }
  }
`;

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string
): Promise<Post[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(
      GET_RELATED_POSTS,
      { categorySlug, excludeId },
      { revalidate: 120 }
    );
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// ─── Get Categories ───

const GET_CATEGORIES = `
  query GetCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchGraphQL<{ categories: { nodes: Category[] } }>(
      GET_CATEGORIES,
      undefined,
      { revalidate: 300, tags: ['categories'] }
    );
    return data.categories.nodes;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

