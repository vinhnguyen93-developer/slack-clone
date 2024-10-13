'use client'

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export default function Home() {
  const router = useRouter()
  const { signOut } = useAuthActions()

  return (
    <div>
      Logged in!
      <Button onClick={() => {
        signOut()
          .finally(() => {
            router.push('/auth')
          })
      }}>
        Sign out
      </Button>
    </div>
  )
}
