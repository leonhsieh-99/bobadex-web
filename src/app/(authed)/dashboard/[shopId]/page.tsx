import ShopDetails from "@/features/shops/components/ShopDetails";

export default async function ShopDetailsPage({ params }: { params: Promise<{shopId: string}> }) {
  const { shopId } = await params;
  return <ShopDetails shopId={shopId} />;
}