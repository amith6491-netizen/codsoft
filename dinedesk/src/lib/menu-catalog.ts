export type CatalogItem = { id: number; name: string; price: number };

// This mirrors the current static menu until MenuItem records are seeded.
// Checkout always resolves prices from this server-only module, never from the browser.
export const menuCatalog: CatalogItem[] = [
  { id: 1, name: 'Classic Caesar Salad', price: 349 }, { id: 2, name: 'Paneer Tikka', price: 449 },
  { id: 3, name: 'Crispy Calamari', price: 399 }, { id: 4, name: 'Tomato Bruschetta', price: 249 },
  { id: 5, name: 'Garlic Butter Mushrooms', price: 299 }, { id: 6, name: 'Chicken Lollipop', price: 499 },
  { id: 7, name: 'Spinach Artichoke Dip', price: 349 }, { id: 8, name: 'Prawn Cocktail', price: 549 },
  { id: 9, name: 'Spring Rolls (6 pcs)', price: 279 }, { id: 10, name: 'French Onion Soup', price: 329 },
  { id: 11, name: 'The Signature Double Burger', price: 649 }, { id: 12, name: 'Truffle Mushroom Pasta', price: 849 },
  { id: 13, name: 'Rustic Margherita Pizza', price: 699 }, { id: 14, name: 'Butter Chicken Curry', price: 649 },
  { id: 15, name: 'Grilled Atlantic Salmon', price: 1199 }, { id: 16, name: 'Lamb Rogan Josh', price: 899 },
  { id: 17, name: 'Chicken Alfredo Pasta', price: 749 }, { id: 18, name: 'Veggie Supreme Pizza', price: 649 },
  { id: 19, name: 'Dal Makhani & Naan', price: 499 }, { id: 20, name: 'BBQ Ribs Half Rack', price: 1099 },
  { id: 21, name: 'Molten Chocolate Lava Cake', price: 449 }, { id: 22, name: 'Gulab Jamun (4 pcs)', price: 249 },
  { id: 23, name: 'Classic Tiramisu', price: 399 }, { id: 24, name: 'New York Cheesecake', price: 429 },
  { id: 25, name: 'Mango Panna Cotta', price: 379 }, { id: 26, name: 'Crème Brûlée', price: 449 },
  { id: 27, name: 'Sticky Toffee Pudding', price: 419 }, { id: 28, name: 'Rasmalai (2 pcs)', price: 299 },
  { id: 29, name: 'Ice Cream Sundae', price: 349 }, { id: 30, name: 'Waffles & Maple Syrup', price: 399 },
  { id: 31, name: 'Fresh Mango Lassi', price: 199 }, { id: 32, name: 'Virgin Mojito', price: 229 },
  { id: 33, name: 'Cold Brew Coffee', price: 269 }, { id: 34, name: 'Watermelon Juice', price: 179 },
  { id: 35, name: 'Masala Chai', price: 99 }, { id: 36, name: 'Blueberry Smoothie', price: 249 },
  { id: 37, name: 'Sparkling Lemonade', price: 199 }, { id: 38, name: 'Espresso Martini (Mocktail)', price: 299 },
  { id: 39, name: 'Rose Sharbat', price: 149 }, { id: 40, name: 'Pineapple Iced Tea', price: 219 },
];