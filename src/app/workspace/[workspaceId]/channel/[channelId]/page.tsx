'use client';

import { Loader, TriangleAlert } from "lucide-react";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useChannelId } from "@/hooks/use-channel-id";

import { UseGetChannel } from "@/app/features/channels/api/use-get-channel";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = UseGetChannel({ id: channelId });

  if (channelLoading) {
    return (
      <div className="h-full flex items-center justify-center flex-1">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center flex-1">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />

      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
}

export default ChannelIdPage;