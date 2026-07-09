// ─── Post Types ───

export interface WPImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: {
    width: number;
    height: number;
  };
}

export interface TechnicalSheet {
  camera: string | null;
  lens: string | null;
  filmStock: string | null;
  year: string | null;
  location: string | null;
}

export interface PostExtended {
  subtitle: string | null;
  readingTime: number | null;
  featuredLabel: string | null;
  heroImage: { node: WPImage } | null;
  authorPhoto: { node: WPImage } | null;
  isFeatured: boolean;
  pullQuote: string | null;
  technicalSheet: TechnicalSheet | null;
}

export interface PostSEO {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: { sourceUrl: string } | null;
  twitterTitle: string;
  twitterDescription: string;
  schema: { raw: string } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  avatar?: { url: string };
  description?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  date: string;
  modified?: string;
  featuredImage: { node: WPImage } | null;
  categories: { nodes: Category[] };
  tags?: { nodes: Tag[] };
  author: { node: Author };
  postExtended: PostExtended;
  seo?: PostSEO;
}

// ─── Menu Types ───

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  parentId: string | null;
  cssClasses: string[];
  childItems?: { nodes: MenuItem[] };
}

export interface Menu {
  menuItems: {
    nodes: MenuItem[];
  };
}

// ─── Site Settings ───

export interface SiteSettings {
  generalSettings: {
    title: string;
    description: string;
  };
  customLogo: WPImage | null;
  homepageSettings?: string;
}

// ─── Pagination ───

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface PaginatedPosts {
  pageInfo: PageInfo;
  nodes: Post[];
}

// ─── GraphQL Response Wrappers ───

export interface HomepageData {
  featuredPosts: { nodes: Post[] };
  latestPosts: { nodes: Post[] };
}

export interface SinglePostData {
  post: Post;
}

export interface ArchiveData {
  posts: PaginatedPosts;
}

export interface SearchData {
  posts: { nodes: Post[] };
}

export interface CategoriesData {
  categories: { nodes: Category[] };
}

export interface MenuData {
  menus: { nodes: Menu[] };
}
