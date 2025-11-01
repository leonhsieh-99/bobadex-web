'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { SearchParams } from "next/dist/server/request/search-params"

import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    next: formData.get('next') as string
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  const safeNext = data.next.startsWith('/') ? data.next : '/dashboard'
  redirect(safeNext)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('layout')
  redirect('/')
}