import ShopDetails from "@/features/shops/components/ShopDetails";

export default function ShopDetailsPage({ params }: { params: { shopId: string } }) {
  const shopId = params.shopId;
  return <ShopDetails shopId={shopId} />;
}