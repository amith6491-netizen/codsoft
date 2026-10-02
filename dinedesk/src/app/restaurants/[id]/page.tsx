import { notFound } from 'next/navigation';
import { initialRestaurants } from '@/lib/restaurants-data';
import { menuItems } from '@/lib/menu-items';
import RestaurantMenuClient from './RestaurantMenuClient';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const restaurant = initialRestaurants.find(
    (r) => r.id.toLowerCase() === decodedId || r.slug.toLowerCase() === decodedId
  );

  if (!restaurant) {
    notFound();
  }

  // Get this restaurant's specific menu items
  const restaurantItems = menuItems.filter((item) =>
    restaurant.menuItemIds.includes(item.id)
  );

  return <RestaurantMenuClient restaurant={restaurant} items={restaurantItems} />;
}
