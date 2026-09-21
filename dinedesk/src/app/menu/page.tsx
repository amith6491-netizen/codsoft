'use client';

import Image from 'next/image';
import { Plus, Search, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useMemo } from 'react';

// ── Menu Data ─────────────────────────────────────────────────────────────────
const menuItems = [
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

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];

// Format price in Indian Rupees
function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function MenuPage() {
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addToCart({ ...item, price: item.price });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">Our Menu</h1>
          <p className="text-foreground/70 max-w-xl">
            Explore our diverse selection of culinary creations crafted with passion and the finest ingredients.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-3 mb-10 pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === category
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-card border border-border hover:border-primary/50 text-foreground/80'
            }`}
          >
            {category}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeCategory === category ? 'bg-white/20' : 'bg-foreground/10'}`}>
              {category === 'All' ? menuItems.length : menuItems.filter(i => i.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-foreground/50">
          <p className="text-xl font-medium mb-2">No dishes found</p>
          <p className="text-sm">Try searching with a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-foreground/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow-sm text-sm text-primary">
                  {formatINR(item.price)}
                </div>
                <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold font-outfit mb-2 leading-tight">{item.name}</h3>
                <p className="text-foreground/60 text-xs mb-5 flex-1 line-clamp-3">{item.description}</p>

                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                    addedItem === item.id
                      ? 'bg-green-500 text-white'
                      : 'bg-background border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary'
                  }`}
                >
                  {addedItem === item.id ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
