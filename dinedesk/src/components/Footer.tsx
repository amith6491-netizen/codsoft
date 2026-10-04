export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-outfit text-2xl font-bold tracking-tight mb-4 block">DineDesk</span>
            <p className="text-foreground/60 max-w-xs">
              A complete restaurant ordering and table management system. Bringing digital innovation to your dining experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-foreground/60">
              <li><a href="/menu" className="hover:text-primary transition-colors">Menu</a></li>
              <li><a href="/cart" className="hover:text-primary transition-colors">Restaurants</a></li>
              <li><a href="/reservations" className="hover:text-primary transition-colors">Reservations</a></li>
              <li><a href="/kitchen" className="hover:text-primary transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-foreground/60">
              <li>Manipal, Karnataka</li>
              <li>Udupi, 576104</li>
              <li>amith6491@gmail.com</li>
              <li>(+91) 7899472591</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Hours</h3>
            <ul className="space-y-2 text-foreground/60">
              <li>Mon-Fri: 11am - 10pm</li>
              <li>Sat-Sun: 10am - 11pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-foreground/50 text-sm">
          <p>&copy; {new Date().getFullYear()} DineDesk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
