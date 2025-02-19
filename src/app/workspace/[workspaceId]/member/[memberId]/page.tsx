'use client';

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader, TriangleAlert } from "lucide-react";

import { Conversation } from "./conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useCreateOrGetConversation } from "@/app/features/conversations/api/use-create-or-get-conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    }, {
      onSuccess(data) {
        setConversationId(data)
      },
      onError() {
        toast.error('Failed to create or get conversation')
      }
    })
  }, [memberId, workspaceId, mutate])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    )
  }

  return <Conversation id={conversationId} />
}

export default MemberIdPage;