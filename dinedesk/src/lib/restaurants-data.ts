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
}

export const initialRestaurants: Restaurant[] = [
  {
    id: 'grand-bistro',
    name: 'The Grand Bistro',
    slug: 'the-grand-bistro',
    tagline: 'Artisanal European Cuisine & Fresh Pastas',
    description: 'Experience European culinary elegance with freshly rolled handmade pastas, wood-fired artisanal pizzas, and decadent hand-crafted desserts in a relaxed modern dining atmosphere.',
    cuisine: ['European', 'Italian', 'Continental'],
    rating: 4.8,
    reviewsCount: 342,
    deliveryTime: '25-35 mins',
    priceForTwo: 1200,
    location: 'Indiranagar, Bangalore',
    address: '42, 100ft Road, Indiranagar, Bangalore - 560038',
    image: '/pasta.jpg',
    featured: true,
    menuItemIds: [1, 4, 5, 10, 12, 13, 17, 21, 23, 24, 26, 32, 33, 38],
  },
  {
    id: 'spice-symphony',
    name: 'Spice Symphony',
    slug: 'spice-symphony',
    tagline: 'Royal North Indian & Tandoori Delicacies',
    description: 'Rich slow-cooked gravies, smoky tandoori kebabs, and authentic royal Awadhi and Punjabi recipes crafted by master chefs using fragrant whole spices.',
    cuisine: ['North Indian', 'Mughlai', 'Tandoori'],
    rating: 4.7,
    reviewsCount: 512,
    deliveryTime: '30-40 mins',
    priceForTwo: 950,
    location: 'Koramangala, Bangalore',
    address: '88, 5th Block, Koramangala, Bangalore - 560095',
    image: '/burger.jpg',
    featured: true,
    menuItemIds: [2, 6, 9, 14, 16, 19, 22, 28, 31, 35, 39],
  },
  {
    id: 'ocean-and-coast',
    name: 'Ocean & Coast',
    slug: 'ocean-and-coast',
    tagline: 'Fresh Seafood, Grilled Specialties & Healthy Salads',
    description: 'Sourced daily from coastal fisheries, we serve flame-grilled salmon, crispy calamari, gourmet salads, and refreshing mocktails overlooking a calming ocean-inspired ambiance.',
    cuisine: ['Seafood', 'Grills', 'Salads'],
    rating: 4.9,
    reviewsCount: 228,
    deliveryTime: '35-45 mins',
    priceForTwo: 1600,
    location: 'Lavelle Road, Bangalore',
    address: '15, Lavelle Road, Central Business District, Bangalore - 560001',
    image: '/salad.jpg',
    featured: true,
    menuItemIds: [1, 3, 7, 8, 15, 25, 27, 34, 37, 40],
  },
  {
    id: 'smoke-and-barrel',
    name: 'Smoke & Barrel Co.',
    slug: 'smoke-and-barrel',
    tagline: 'Gourmet Smashed Burgers, BBQ Ribs & Craft Beverages',
    description: 'House-ground artisan burgers, 12-hour applewood smoked BBQ ribs, crispy loaded sides, and handcrafted sodas made with love and fire.',
    cuisine: ['American', 'BBQ', 'Burgers'],
    rating: 4.6,
    reviewsCount: 410,
    deliveryTime: '20-30 mins',
    priceForTwo: 850,
    location: 'HSR Layout, Bangalore',
    address: '102, 27th Main, Sector 1, HSR Layout, Bangalore - 560102',
    image: '/hero.jpg',
    featured: false,
    menuItemIds: [6, 9, 11, 18, 20, 29, 30, 33, 36, 37],
  },
];
