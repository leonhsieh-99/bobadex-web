export default function ShopsView({shops, isOwner} : {shops: any[], isOwner: boolean}) {
  return (
    <div className="">
      {shops.map((shop) => (
        <div key={shop.id} className="rounded border p-3 flex justify-between items-center">
        <div>
          <p className="font-medium">{shop.name}</p>
          <p className="text-sm text-muted-foreground">{shop.rating ?? "No rating"}</p>
        </div>
        {isOwner && (
          <a href={`/shops/${shop.id}/edit`} className="text-sm underline">
            Edit
          </a>
        )}
      </div>
      ))}
    </div>
  )
}