export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  priceForTwo: number;
  location: string;
  address: string;
  image: string;
  featured: boolean;
  menuItemIds: number[];
  sourceUrl?: string;
}

export const initialRestaurants: Restaurant[] = [
  {
    id: 'shiro-experience',
    name: 'Shiro Pan-Asian & Sushi Lounge',
    slug: 'shiro-experience',
    tagline: 'High-Ceiling Luxury Pan-Asian Dining & Artisanal Sushi',
    description: 'Inspired by Japanese castles and grand Asian sanctuaries, Shiro at UB City is celebrated for its theatrical dining, master-crafted sushi rolls, steamed dim sums, and vibrant Cantonese & Thai delicacies.',
    cuisine: ['Pan-Asian', 'Japanese', 'Sushi', 'Dim Sum', 'Thai'],
    rating: 4.8,
    reviewsCount: 840,
    deliveryTime: '30-40 mins',
    priceForTwo: 3200,
    location: 'UB City, Vittal Mallya Road, Bangalore',
    address: 'Level 2 & 3, The Collection, UB City, Vittal Mallya Road, Bangalore - 560001',
    image: '/hero.jpg',
    featured: true,
    menuItemIds: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112],
    sourceUrl: 'https://www.shiroexperience.com/',
  },
  {
    id: 'le-cirque-signature',
    name: 'Le Cirque Signature',
    slug: 'le-cirque-signature',
    tagline: 'Iconic Franco-Italian Haute Cuisine by The Leela Palace',
    description: 'Set beneath an ornate Murano chandelier on the fifth floor of The Leela Palace, Le Cirque Signature presents delicate French gastronomy alongside hearty, comforting Italian masterpieces crafted with world-class finesse.',
    cuisine: ['Franco-Italian', 'French', 'Italian', 'Fine Dining'],
    rating: 4.9,
    reviewsCount: 620,
    deliveryTime: '35-45 mins',
    priceForTwo: 4500,
    location: 'The Leela Palace, Old Airport Road, Bangalore',
    address: 'Fifth Floor, The Leela Palace, 23 HAL Old Airport Road, Bangalore - 560008',
    image: '/pasta.jpg',
    featured: true,
    menuItemIds: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212],
    sourceUrl: 'https://www.theleela.com/the-leela-palace-bengaluru/restaurants/le-cirque-signature',
  },
  {
    id: 'jamavar-palace',
    name: 'Jamavar Royal Dining',
    slug: 'jamavar-palace',
    tagline: 'Opulent Awadhi Dum Pukht & Royal Indian Gastronomy',
    description: 'Named after the legendary royal embroidery of Kashmir, Jamavar at The Leela Palace showcases time-honored Indian royal recipes, succulent tandoor kebabs, slow-cooked gravies, and fragrant dum biryanis.',
    cuisine: ['North Indian', 'Awadhi', 'Mughlai', 'Tandoori'],
    rating: 4.9,
    reviewsCount: 980,
    deliveryTime: '30-40 mins',
    priceForTwo: 3800,
    location: 'The Leela Palace, Old Airport Road, Bangalore',
    address: 'Lobby Level, The Leela Palace, 23 HAL Old Airport Road, Bangalore - 560008',
    image: '/burger.jpg',
    featured: true,
    menuItemIds: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312],
    sourceUrl: 'https://www.theleela.com/the-leela-palace-bengaluru/restaurants/jamavar',
  },
  {
    id: 'citrus-bistro',
    name: 'Citrus Mediterranean Brasserie',
    slug: 'citrus-bistro',
    tagline: 'Sun-Kissed Mediterranean & All-Day Continental Grills',
    description: 'An idyllic open-kitchen restaurant at The Leela Palace overlooking lush landscaped waterfall gardens, offering wood-fired pizzas, crisp Mediterranean salads, fresh Atlantic seafood, and handcrafted mocktails.',
    cuisine: ['Mediterranean', 'Continental', 'European', 'Pizza'],
    rating: 4.7,
    reviewsCount: 450,
    deliveryTime: '25-35 mins',
    priceForTwo: 2800,
    location: 'The Leela Palace, Old Airport Road, Bangalore',
    address: 'Ground Floor, The Leela Palace, 23 HAL Old Airport Road, Bangalore - 560008',
    image: '/pizza.jpg',
    featured: true,
    menuItemIds: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411],
    sourceUrl: 'https://www.theleela.com/the-leela-palace-bengaluru/restaurants/citrus',
  },
];
