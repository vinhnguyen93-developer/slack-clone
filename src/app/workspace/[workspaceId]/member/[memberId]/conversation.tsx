import { Loader } from "lucide-react";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

import { usePanel } from "@/hooks/use-panel";
import { useMemberId } from "@/hooks/use-member-id";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { useGetMessages } from "@/app/features/messages/api/use-get-messages";
import { useGetMember } from "@/app/features/members/api/use-get-member";

interface ConversationProps {
  id: Id<'conversations'>;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel()

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />

      <MessageList
        data={results}
        variant="conversation"
        loadMore={loadMore}
        memberImage={member?.user.image}
        memberName={member?.user.name}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />

      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  )
}