import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ShopsView from "@/components/layout/ShopsView";

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
        <ShopsView shops = {shops ?? []} isOwner = {isOwner}/>
      </div>
    )
}