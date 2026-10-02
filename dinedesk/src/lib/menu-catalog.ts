import { menuItems } from './menu-items';

export type CatalogItem = { id: number; name: string; price: number };

// Checkout always resolves prices from this server-only module, never from the browser.
export const menuCatalog: CatalogItem[] = menuItems.map(({ id, name, price }) => ({
  id,
  name,
  price,
}));