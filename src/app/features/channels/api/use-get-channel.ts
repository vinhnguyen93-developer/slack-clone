import { useQuery } from 'convex/react';

import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';

interface UseGetChannelProps {
  id: Id<'channels'>;
}

export const UseGetChannel = ({ id }: UseGetChannelProps) => {
  const data = useQuery(api.channel.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
