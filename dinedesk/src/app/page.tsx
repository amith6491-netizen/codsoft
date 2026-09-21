import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Clock, ChefHat, Utensils } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Delicious gourmet dish in a modern restaurant"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium mb-6 backdrop-blur-sm">
            Elevating your dining experience
          </span>
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-white mb-6 leading-tight">
            Taste the extraordinary at <span className="text-primary">DineDesk</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Experience culinary excellence with our curated menu, seamless ordering, and effortless reservations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/menu" 
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Order Online
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/reservations" 
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all backdrop-blur-md w-full sm:w-auto justify-center"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Master Chefs</h3>
              <p className="text-foreground/70">Our culinary team brings years of experience to create unforgettable flavors.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Premium Quality</h3>
              <p className="text-foreground/70">We source only the finest, freshest ingredients from local producers.</p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Fast Service</h3>
              <p className="text-foreground/70">Enjoy your meal without the wait. Our streamlined kitchen ensures prompt delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">Featured Delights</h2>
              <p className="text-foreground/70 max-w-2xl">Discover our chef's handpicked favorites that keep our guests coming back for more.</p>
            </div>
            <Link href="/menu" className="hidden md:flex text-primary font-medium items-center gap-1 hover:underline">
              View full menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dish 1 */}
            <div className="group rounded-3xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/burger.jpg" 
                  alt="Gourmet Burger" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow-sm text-primary">
                  ₹649
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-outfit mb-2">The Signature Double</h3>
                <p className="text-foreground/70 mb-4 line-clamp-2">A juicy, gourmet double cheeseburger with fresh lettuce, tomatoes, and melted cheese, served on a wooden board with artisan fries.</p>
                <button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                  Add to Order
                </button>
              </div>
            </div>

            {/* Dish 2 */}
            <div className="group rounded-3xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/pasta.jpg" 
                  alt="Truffle Mushroom Pasta" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow-sm text-primary">
                  ₹849
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-outfit mb-2">Truffle Mushroom Pasta</h3>
                <p className="text-foreground/70 mb-4 line-clamp-2">A beautiful plate of handmade truffle mushroom pasta garnished with fresh herbs and parmesan cheese.</p>
                <button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                  Add to Order
                </button>
              </div>
            </div>
            
            {/* CTA Card */}
            <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Utensils className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-outfit mb-4">Craving more?</h3>
              <p className="text-foreground/70 mb-8">Explore our full menu featuring appetizers, mains, desserts, and handcrafted beverages.</p>
              <Link href="/menu" className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors">
                Explore Full Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
