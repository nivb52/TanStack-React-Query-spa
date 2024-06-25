import { toast } from '@/components/app/toast';
import { MutationCache, QueryCache, QueryClient, QueryClientConfig } from '@tanstack/react-query';

export function createTitle(
  action: 'fetch' | 'mutation',
  errorMsg: string | null | undefined = 'error connecting to server'
) {
  return `could not ${action} data: ${errorMsg}`;
}

function errorHandler(title: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries (e.g" on the staff page  (staff, treatments, user))
  const id = 'react-query-toast';
  if (!toast.isActive(id)) {
    toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
  }
}

function mutationErrorHandler(errorMsg: string) {
  errorHandler(createTitle('mutation', errorMsg));
}

function queryErrorHandler(errorMsg: string) {
  errorHandler(createTitle('fetch', errorMsg));
}

/////////////// MAIN ///////////////////////
export const queryClientOptions: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (err) => queryErrorHandler(err.message)
  }),
  mutationCache: new MutationCache({
    onError: (err) => mutationErrorHandler(err.message)
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      // good advice is not to define it here but increase the stale time
      refetchOnWindowFocus: false
    }
  }
};
export const queryClient = new QueryClient(queryClientOptions);
