import { fetchGraphQL } from '../wordpress';
import type { CategoriesData, Category } from '../types';

const GET_ALL_CATEGORIES = `
  query GetCategories {
    categories(first: 50, where: { hideEmpty: false }) {
      nodes {
        id
        name
        slug
        count
        description
      }
    }
  }
`;

export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchGraphQL<CategoriesData>(GET_ALL_CATEGORIES, undefined, {
    revalidate: 300,
    tags: ['categories'],
  });
  return data.categories.nodes;
}

const GET_ALL_CATEGORY_SLUGS = `
  query GetAllCategorySlugs {
    categories(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  const data = await fetchGraphQL<{ categories: { nodes: { slug: string }[] } }>(
    GET_ALL_CATEGORY_SLUGS,
    undefined,
    { revalidate: 300 }
  );
  return data.categories.nodes;
}
