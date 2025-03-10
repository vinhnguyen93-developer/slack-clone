'use client'

import { Loader } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { useGetWorkspaces } from "./features/workspaces/api/use-get-workspaces"
import { useCreateWorkspaceModal } from "./features/workspaces/store/use-create-workspace-modal"

export default function Home() {
  const router = useRouter()

  const [open, setOpen] = useCreateWorkspaceModal()
  const { data, isLoading } = useGetWorkspaces()

  const workspacesId = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      router.replace(`/workspace/${workspacesId}`)
    } else if (!open) {
      setOpen(true)
    }
  }, [workspacesId, isLoading, open, setOpen, router])

  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
