import { getKitchenOrders } from '@/actions/kitchen';
import KitchenDashboardClient from './KitchenDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kitchen Dashboard | DineDesk',
  description: 'Live kitchen order dispatch and preparation manager',
};

export default async function KitchenDashboardPage() {
  const orders = await getKitchenOrders();

  return <KitchenDashboardClient initialOrders={orders} />;
}
