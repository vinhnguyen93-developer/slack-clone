'use client';

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import VerificationInput from 'react-verification-input'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetWorkspaceInfo } from "@/app/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/app/features/workspaces/api/use-join";

const JoinPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useJoin()
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember])

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`)
    }
  }, [isMember, router, workspaceId])

  const handleComplete = (value: string) => {
    mutate({ joinCode: value, workspaceId }, {
      onSuccess: (id) => {
        router.replace(`/workspace/${id}`)
        toast.success('Workspace joined.')
      },
      onError: () => {
        toast.error('Failed to join workspace.')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src='/slack.png' width={60} height={60} alt="Logo slack" />

      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
        </div>

        <VerificationInput
          onComplete={handleComplete}
          length={6}
          autoFocus
          classNames={{
            container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
            character: 'rounded-md border border-gray-300 uppercase h-auto flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
        />
      </div>

      <div className="flex gap-x-4">
        <Button
          size='lg'
          variant='outline'
          asChild
        >
          <Link href='/'>
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default JoinPage;