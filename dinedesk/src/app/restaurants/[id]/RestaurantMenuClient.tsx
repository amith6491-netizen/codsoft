'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Check,
  Search,
  Calendar,
  Share2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Restaurant } from '@/lib/restaurants-data';
import { MenuItemData } from '@/lib/menu-items';

interface RestaurantMenuClientProps {
  restaurant: Restaurant;
  items: MenuItemData[];
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function RestaurantMenuClient({
  restaurant,
  items,
}: RestaurantMenuClientProps) {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => cats.add(item.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

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

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all restaurants
        </Link>
      </div>

      {/* Restaurant Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-border shadow-lg bg-card mb-12">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-2">
              {restaurant.cuisine.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 bg-background/80 hover:bg-background backdrop-blur-md rounded-full text-foreground transition-all shadow-md"
              title="Share restaurant"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom Details */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold drop-shadow-md">
                {restaurant.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                <Star className="w-3.5 h-3.5 fill-white" />
                {restaurant.rating} ({restaurant.reviewsCount} reviews)
              </span>
            </div>

            <p className="text-white/90 text-sm sm:text-base font-medium max-w-3xl mb-4 drop-shadow">
              {restaurant.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {restaurant.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {restaurant.deliveryTime}
              </span>
              <span className="font-semibold text-white">
                ₹{restaurant.priceForTwo.toLocaleString('en-IN')} for two
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="p-4 sm:p-6 bg-card border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-foreground/70 max-w-2xl leading-relaxed">
            {restaurant.description}
          </p>

          <Link
            href="/reservations"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20 shrink-0"
          >
            <Calendar className="w-4 h-4" /> Book a Table at {restaurant.name}
          </Link>
        </div>
      </div>

      {/* Menu Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-outfit font-bold">
            {restaurant.name}&apos;s Menu
          </h2>
          <p className="text-foreground/60 text-sm mt-1">
            Browse dishes exclusively crafted at this location.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search this menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-10 pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {category}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === category
                  ? 'bg-white/20'
                  : 'bg-foreground/10'
              }`}
            >
              {category === 'All'
                ? items.length
                : items.filter((i) => i.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-3xl p-6">
          <p className="text-lg font-bold font-outfit mb-1">No dishes match your search</p>
          <p className="text-foreground/60 text-sm mb-4">
            Try a different search word or select another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-semibold"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image banner */}
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

              {/* Details & Button */}
              <div className="p-5 flex flex-col flex-1">
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
