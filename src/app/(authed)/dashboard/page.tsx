import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ShopsView from "@/features/shops/components/ShopsView";
import { Shop } from "@/features/shops/types";

export default async function Dashboard({
    searchParams
  } : {
    searchParams?: { userId?: string }
  }) {
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) redirect('/auth/login')

    const { userId } = await searchParams!
    const otherUserId = userId
    const ownerId = otherUserId ? otherUserId : currentUser.id
    const isOwner = ownerId == currentUser.id

    const { data: shops } = await supabase
      .from('shops')
      .select()
      .eq('user_id', ownerId)

    console.log(shops)

    return (
      <div className="">
        <h1 className="text-2xl font-bold">
          Bobadex
        </h1>
        <main
          className="
            flex-1 grid
            [grid-template-columns:calc(65%-1%)_calc(35%-1%)]
            gap-x-[2%]
            px-10 py-3
          "
        >
          {/* LEFT SIDE */}
          <section className="flex min-h-0 flex-col border rounded-xl overflow-hidden">
            {/* Search Bar Here */}

            {/* SHOPS VIEW */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ShopsView shops = {shops as Shop[] ?? []} isOwner = {isOwner}/>
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto border rounded-xl">
            {/* SGOP DETAILS HERE */}
          </aside>
        </main>
      </div>
    )
}