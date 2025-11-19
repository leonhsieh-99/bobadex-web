'use client'

import React from "react"
import { cn } from "@/lib/utils"

type TopNavProps = React.ComponentProps<"nav">

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "h-14 flex items-center px-4 border-b bg-white/80 backdrop-blur",
          className
        )}
        {...props}
      >
        TOP NAV PLACEHOLDER
      </nav>
    )
  }
)

TopNav.displayName = "TopNav"
export default TopNav