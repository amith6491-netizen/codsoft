export interface MenuItemData {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const menuItems: MenuItemData[] = [
  // STARTERS (10)
  { id: 1,  name: 'Classic Caesar Salad',        description: 'Crisp romaine lettuce with grilled chicken, crunchy croutons, shaved parmesan, and house Caesar dressing.', price: 349,  image: '/salad.jpg',   category: 'Starters' },
  { id: 2,  name: 'Paneer Tikka',                description: 'Soft cottage cheese marinated in spiced yogurt, char-grilled in a tandoor and served with mint chutney.', price: 449,  image: '/salad.jpg',   category: 'Starters' },
  { id: 3,  name: 'Crispy Calamari',             description: 'Tender squid rings lightly breaded and fried golden, served with a zesty lemon aioli dip.', price: 399,  image: '/salad.jpg',   category: 'Starters' },
  { id: 4,  name: 'Tomato Bruschetta',           description: 'Toasted sourdough topped with vine-ripened tomatoes, fresh basil, garlic, and extra-virgin olive oil.', price: 249,  image: '/salad.jpg',   category: 'Starters' },
  { id: 5,  name: 'Garlic Butter Mushrooms',     description: 'Sautéed button mushrooms in garlic-herb butter sauce, served on toasted artisan bread.', price: 299,  image: '/salad.jpg',   category: 'Starters' },
  { id: 6,  name: 'Chicken Lollipop',            description: 'Spicy Indo-Chinese style chicken lollipops with a crispy coating, served with sweet chilli sauce.', price: 499,  image: '/salad.jpg',   category: 'Starters' },
  { id: 7,  name: 'Spinach Artichoke Dip',       description: 'A warm, creamy dip of spinach and artichokes with melted cheese, served with tortilla chips.', price: 349,  image: '/salad.jpg',   category: 'Starters' },
  { id: 8,  name: 'Prawn Cocktail',              description: 'Chilled tiger prawns with classic Marie Rose sauce on crisp iceberg lettuce — a timeless classic.', price: 549,  image: '/salad.jpg',   category: 'Starters' },
  { id: 9,  name: 'Spring Rolls (6 pcs)',        description: 'Crispy vegetarian spring rolls stuffed with seasoned vegetables, served with sweet chilli dipping sauce.', price: 279,  image: '/salad.jpg',   category: 'Starters' },
  { id: 10, name: 'French Onion Soup',           description: 'Classic slow-caramelised onion soup topped with a thick layer of melted Gruyère cheese and toasted crouton.', price: 329,  image: '/salad.jpg',   category: 'Starters' },

  // MAINS (10)
  { id: 11, name: 'The Signature Double Burger',  description: 'A towering gourmet double cheeseburger with fresh lettuce, tomatoes, and melted cheese, served with hand-cut fries.', price: 649,  image: '/burger.jpg',  category: 'Mains' },
  { id: 12, name: 'Truffle Mushroom Pasta',       description: 'Handmade pappardelle tossed in a rich truffle and wild mushroom cream sauce, finished with shaved Parmesan.', price: 849,  image: '/pasta.jpg',   category: 'Mains' },
  { id: 13, name: 'Rustic Margherita Pizza',      description: 'Wood-fired Neapolitan base with San Marzano tomato sauce, bubbling fior di latte mozzarella, and fresh basil.', price: 699,  image: '/pizza.jpg',   category: 'Mains' },
  { id: 14, name: 'Butter Chicken Curry',         description: 'Succulent chicken cooked in a velvety, mildly spiced tomato-butter gravy. Served with garlic naan and basmati rice.', price: 649,  image: '/burger.jpg',  category: 'Mains' },
  { id: 15, name: 'Grilled Atlantic Salmon',      description: 'Premium Atlantic salmon fillet, seared skin-crisp, served with herbed risotto and a lemon beurre blanc.', price: 1199, image: '/pasta.jpg',   category: 'Mains' },
  { id: 16, name: 'Lamb Rogan Josh',              description: 'Tender slow-braised lamb in an aromatic Kashmiri gravy of whole spices, served with saffron pulao.', price: 899,  image: '/burger.jpg',  category: 'Mains' },
  { id: 17, name: 'Chicken Alfredo Pasta',        description: 'Fettuccine pasta tossed with grilled chicken strips in a rich, creamy Alfredo sauce and topped with herbs.', price: 749,  image: '/pasta.jpg',   category: 'Mains' },
  { id: 18, name: 'Veggie Supreme Pizza',         description: 'Generous toppings of bell peppers, olives, mushrooms, sweet corn, red onion, and jalapeños on a crispy base.', price: 649,  image: '/pizza.jpg',   category: 'Mains' },
  { id: 19, name: 'Dal Makhani & Naan',           description: 'Slow-simmered black lentils in a rich, buttery tomato gravy, served with tandoori naan and jeera rice.', price: 499,  image: '/burger.jpg',  category: 'Mains' },
  { id: 20, name: 'BBQ Ribs Half Rack',           description: 'Slow-cooked pork ribs glazed with smoky BBQ sauce, served with coleslaw and golden French fries.', price: 1099, image: '/burger.jpg',  category: 'Mains' },

  // DESSERTS (10)
  { id: 21, name: 'Molten Chocolate Lava Cake',  description: 'A warm, decadent chocolate cake with a gooey molten centre, served with a scoop of vanilla bean ice cream.', price: 449,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 22, name: 'Gulab Jamun (4 pcs)',          description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup, served warm with a sprinkle of pistachios.', price: 249,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 23, name: 'Classic Tiramisu',             description: 'Layers of espresso-soaked ladyfinger biscuits and mascarpone cream, dusted with rich cocoa powder.', price: 399,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 24, name: 'New York Cheesecake',          description: 'A dense and creamy baked cheesecake on a buttery Graham cracker crust, topped with a fresh berry compote.', price: 429,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 25, name: 'Mango Panna Cotta',            description: 'Velvety vanilla panna cotta topped with a vibrant Alphonso mango coulis and served chilled.', price: 379,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 26, name: 'Crème Brûlée',                description: 'Classic French custard with a perfectly caramelised sugar crust, infused with real vanilla bean.', price: 449,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 27, name: 'Sticky Toffee Pudding',        description: 'Moist date sponge cake drenched in a warm, buttery toffee sauce, served with clotted cream.', price: 419,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 28, name: 'Rasmalai (2 pcs)',             description: 'Flattened cottage cheese dumplings soaked in saffron-infused, cardamom milk and garnished with almonds.', price: 299,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 29, name: 'Ice Cream Sundae',             description: 'Your choice of two scoops of artisan ice cream, topped with hot fudge, whipped cream, and a wafer.', price: 349,  image: '/dessert.jpg', category: 'Desserts' },
  { id: 30, name: 'Waffles & Maple Syrup',        description: 'Crispy Belgian waffles served with warm maple syrup, fresh strawberries, and a dusting of icing sugar.', price: 399,  image: '/dessert.jpg', category: 'Desserts' },

  // BEVERAGES (10)
  { id: 31, name: 'Fresh Mango Lassi',            description: 'A refreshingly thick and creamy yogurt-based drink blended with ripe Alphonso mangoes and a hint of cardamom.', price: 199,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 32, name: 'Virgin Mojito',                description: 'Fresh lime juice, mint leaves, and sugar muddled together with soda water and crushed ice for a zesty refresher.', price: 229,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 33, name: 'Cold Brew Coffee',             description: 'Smooth, naturally low-acid cold brew steeped for 18 hours and served over ice with a touch of simple syrup.', price: 269,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 34, name: 'Watermelon Juice',             description: 'Freshly pressed watermelon juice served chilled, with a squeeze of lime and a pinch of black salt.', price: 179,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 35, name: 'Masala Chai',                  description: 'A strong, fragrant Indian tea brewed with ginger, cardamom, cloves, and cinnamon with full-cream milk.', price: 99,   image: '/salad.jpg',   category: 'Beverages' },
  { id: 36, name: 'Blueberry Smoothie',           description: 'A thick and creamy blend of fresh blueberries, banana, Greek yogurt, and honey, served chilled.', price: 249,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 37, name: 'Sparkling Lemonade',           description: 'Freshly squeezed lemon juice with sugar syrup, mint, and sparkling water — bright, bubbly, and refreshing.', price: 199,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 38, name: 'Espresso Martini (Mocktail)', description: 'A sophisticated espresso-based mocktail with coffee liqueur syrup, shaken to a perfect frothy head.', price: 299,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 39, name: 'Rose Sharbat',                 description: 'A traditional chilled rose syrup drink with basil seeds (sabja), milk, and a squeeze of lime.', price: 149,  image: '/salad.jpg',   category: 'Beverages' },
  { id: 40, name: 'Pineapple Iced Tea',           description: 'Chilled black tea infused with pineapple juice, a touch of honey, and fresh mint over crushed ice.', price: 219,  image: '/salad.jpg',   category: 'Beverages' },
];
