'use client'

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Brand } from "./types"

const STORAGE_KEY = 'brands-cache-v1'

export function useBrands() {
  // read from local storage once
  const [initialBrands] = useState<Brand[] | undefined>(() => {
    if (typeof window === 'undefined') return undefined
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return undefined
      return JSON.parse(raw) as Brand[];
    } catch {
      return undefined
    }
  })

  const query = useQuery<Brand[]> ({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch('/api/brands')

      if (!res.ok) {
        throw new Error('Failed to fetch brands')
      }
      const data = (await res.json()) as Brand[]
      
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } catch {

        }
      }

      return data
    },
    initialData: initialBrands,
    staleTime: Infinity,
  })

  return query
}