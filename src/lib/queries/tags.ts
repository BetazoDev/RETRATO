import { fetchGraphQL } from '../wordpress';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string | null;
}

interface TagsData {
  tags: {
    nodes: Tag[];
  };
}

const GET_ALL_TAGS = `
  query GetTags {
    tags(first: 100, where: { hideEmpty: false }) {
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

export async function getAllTags(): Promise<Tag[]> {
  const data = await fetchGraphQL<TagsData>(GET_ALL_TAGS, undefined, {
    revalidate: 300,
    tags: ['tags'],
  });
  return data.tags.nodes;
}

const GET_ALL_TAG_SLUGS = `
  query GetAllTagSlugs {
    tags(first: 200) {
      nodes {
        slug
      }
    }
  }
`;

export async function getAllTagSlugs(): Promise<{ slug: string }[]> {
  const data = await fetchGraphQL<{ tags: { nodes: { slug: string }[] } }>(
    GET_ALL_TAG_SLUGS,
    undefined,
    { revalidate: 300 }
  );
  return data.tags.nodes;
}
