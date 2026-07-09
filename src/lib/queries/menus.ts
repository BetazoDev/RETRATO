import { fetchGraphQL } from '../wordpress';
import type { MenuData, SiteSettings } from '../types';

// ─── Primary Navigation Menu ───

const GET_PRIMARY_MENU = `
  query GetPrimaryMenu {
    menus(where: { location: PRIMARY }) {
      nodes {
        menuItems(first: 50) {
          nodes {
            id
            label
            url
            path
            parentId
            cssClasses
          }
        }
      }
    }
  }
`;

export async function getPrimaryMenu() {
  const data = await fetchGraphQL<MenuData>(GET_PRIMARY_MENU, undefined, {
    revalidate: 300,
    tags: ['menus'],
  });
  return data.menus.nodes[0]?.menuItems.nodes || [];
}

// ─── Site Settings (Title, Description, Logo) ───

const GET_SITE_SETTINGS = `
  query GetSiteSettings {
    generalSettings {
      title
      description
    }
    homepageSettings
  }
`;

export async function getSiteSettings() {
  const data = await fetchGraphQL<SiteSettings & { homepageSettings: string }>(GET_SITE_SETTINGS, undefined, {
    revalidate: 600,
    tags: ['settings'],
  });
  
  // Synthesize customLogo from homepageSettings to avoid WPGraphQL 500 error on broken attachments
  let parsedSettings: any = {};
  try {
    parsedSettings = JSON.parse(data.homepageSettings || '{}');
  } catch(e) {}
  
  if (parsedSettings.custom_logo && typeof parsedSettings.custom_logo === 'string') {
    data.customLogo = {
      sourceUrl: parsedSettings.custom_logo,
      altText: data.generalSettings.title,
    } as any;
  } else {
    data.customLogo = null;
  }
  
  return data;
}
