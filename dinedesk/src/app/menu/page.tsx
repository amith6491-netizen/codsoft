'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, Check, Utensils, Store, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useMemo, Suspense } from 'react';
import { menuItems, MenuItemData } from '@/lib/menu-items';
import { initialRestaurants } from '@/lib/restaurants-data';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function MenuContent() {
  const searchParams = useSearchParams();
  const initialRestaurantId = searchParams.get('restaurant') || 'all';

  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState(initialRestaurantId);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRestaurant = useMemo(() => {
    return initialRestaurants.find((r) => r.id === selectedRestaurant);
  }, [selectedRestaurant]);

  const handleAddToCart = (item: MenuItemData) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Filter by restaurant if selected
      if (currentRestaurant && !currentRestaurant.menuItemIds.includes(item.id)) {
        return false;
      }

      // Filter by category
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;

      // Filter by search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [currentRestaurant, activeCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Utensils className="w-3.5 h-3.5" /> Full Food & Drinks Catalog
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold tracking-tight">
            Our Menu
          </h1>
          <p className="text-foreground/70 max-w-xl mt-2 text-base">
            Explore our curated selection of culinary creations crafted with passion and the finest ingredients.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search dishes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Filter by Restaurant Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Store className="w-5 h-5 text-primary shrink-0" />
          <span className="text-sm font-semibold">Filter by Restaurant:</span>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="px-3.5 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Restaurants ({menuItems.length} items)</option>
            {initialRestaurants.map((res) => (
              <option key={res.id} value={res.id}>
                {res.name} ({res.menuItemIds.length} items)
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/restaurants"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 self-end sm:self-auto"
        >
          View all restaurant cards →
        </Link>
      </div>

      {/* Active Restaurant Banner (if selected) */}
      {currentRestaurant && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Selected Restaurant</span>
            </div>
            <h3 className="text-xl font-bold font-outfit mt-0.5">{currentRestaurant.name}</h3>
            <p className="text-xs text-foreground/70 mt-1">{currentRestaurant.tagline} • {currentRestaurant.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/restaurants/${currentRestaurant.id}`}
              className="text-xs px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Restaurant Details
            </Link>
            <button
              onClick={() => setSelectedRestaurant('all')}
              className="text-xs px-3 py-2 bg-card border border-border rounded-xl font-medium hover:bg-foreground/5 transition-colors text-foreground/70"
            >
              Show All
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-medium text-sm transition-all ${
              activeCategory === category
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {category}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === category ? 'bg-white/20' : 'bg-foreground/10'
              }`}
            >
              {category === 'All'
                ? filteredItems.length
                : filteredItems.filter((i) => i.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl p-8">
          <p className="text-xl font-bold font-outfit mb-2">No dishes found</p>
          <p className="text-sm text-foreground/60 mb-6">
            Try searching with a different keyword or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setSelectedRestaurant('all');
            }}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Clear All Filters
          </button>
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
                <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-xs font-semibold">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                {item.restaurantName && (
                  <span className="text-[11px] font-semibold text-primary/90 mb-1 line-clamp-1 flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3" /> {item.restaurantName}
                  </span>
                )}
                <h3 className="text-base font-bold font-outfit mb-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-foreground/60 text-xs mb-5 flex-1 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

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

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-foreground/60">Loading menu...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
