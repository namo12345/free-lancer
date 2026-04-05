/* Static auth — no Supabase browser client needed.
   Kept for import compatibility with hooks/use-realtime.ts */

function noop() {}

const noopChannel = {
  on: () => noopChannel,
  subscribe: () => noopChannel,
  send: noop,
};

export function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ error: { message: "Use static login" } }),
      signInWithOAuth: async () => ({ error: { message: "Use static login" } }),
      signUp: async () => ({ error: { message: "Use static login" } }),
      signOut: async () => ({ error: null }),
    },
    channel: () => noopChannel,
    removeChannel: noop,
  // eslint-disable-next-line
  } as any;
}
