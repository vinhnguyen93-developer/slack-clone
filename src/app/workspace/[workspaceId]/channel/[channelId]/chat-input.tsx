import Quill from "quill"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"

import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

import { useCreateMessage } from "@/app/features/messages/api/use-create-message"

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()

  const handleSubmit = async ({ body, image }: {
    body: string;
    image: File | null
  }) => {
    try {
      setIsPending(true)
      await createMessage({
        workspaceId,
        channelId,
        body
      }, { throwError: true })

      setEditorKey((prevKey) => prevKey + 1)
    } catch (error) {
      toast.error('Fail to send message')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  )
}