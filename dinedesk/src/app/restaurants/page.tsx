'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Search, Star, Clock, MapPin, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { initialRestaurants, Restaurant } from '@/lib/restaurants-data';

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  // Extract all unique cuisines
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    initialRestaurants.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredRestaurants = useMemo(() => {
    return initialRestaurants.filter((restaurant: Restaurant) => {
      const matchesCuisine =
        selectedCuisine === 'All' || restaurant.cuisine.includes(selectedCuisine);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query) ||
        restaurant.cuisine.some((c) => c.toLowerCase().includes(query)) ||
        restaurant.description.toLowerCase().includes(query);
      return matchesCuisine && matchesSearch;
    });
  }, [searchQuery, selectedCuisine]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
          <UtensilsCrossed className="w-4 h-4" /> Curated Dining Destinations
        </div>
        <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4 tracking-tight">
          Explore Our Restaurants
        </h1>
        <p className="text-foreground/70 text-lg leading-relaxed">
          From slow-cooked royal gravies to artisan hand-rolled pasta, choose a dining experience tailored to your cravings and browse its custom menu.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search by restaurant, cuisine, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Cuisine Chips */}
        <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 scrollbar-hide">
          {allCuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCuisine === cuisine
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl p-8">
          <p className="text-xl font-bold font-outfit mb-2">No restaurants found</p>
          <p className="text-foreground/60 text-sm mb-6">
            Try adjusting your search keyword or cuisine filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisine('All');
            }}
            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Cover Image Banner */}
              <div className="relative h-64 w-full overflow-hidden bg-foreground/5">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full font-bold shadow-md text-xs flex items-center gap-1.5 text-foreground">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{restaurant.rating}</span>
                  <span className="text-foreground/50">({restaurant.reviewsCount})</span>
                </div>

                {/* Delivery Time Badge */}
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full font-semibold shadow-md text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{restaurant.deliveryTime}</span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold font-outfit drop-shadow-sm">
                    {restaurant.name}
                  </h2>
                  <p className="text-white/80 text-sm line-clamp-1 drop-shadow-sm">
                    {restaurant.tagline}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Location & Cost for Two */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-foreground/70 gap-2 mb-4 pb-4 border-b border-border">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      {restaurant.location}
                    </span>
                    <span className="font-semibold text-foreground/90">
                      ₹{restaurant.priceForTwo.toLocaleString('en-IN')} for two
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>

                  {/* Cuisine Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {restaurant.cuisine.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-foreground/5 text-foreground/70 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20"
                  >
                    View Menu & Order <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/reservations"
                    className="py-3 px-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold rounded-xl transition-colors text-sm"
                  >
                    Book Table
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
