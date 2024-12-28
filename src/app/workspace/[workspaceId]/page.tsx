'use client'

import { Loader, TriangleAlert } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { UseGetChannels } from "@/app/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/app/features/channels/store/use-create-channel-modal";

const WorkSpaceIdPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
  const { data: channels, isLoading: channelsLoading } = UseGetChannels({ workspaceId })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && isAdmin) {
      setOpen(true)
    }
  }, [
    isAdmin,
    member,
    memberLoading,
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    workspaceId,
    router,
    open,
    setOpen
  ])

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        No channels found
      </span>
    </div>
  )
}

export default WorkSpaceIdPage;