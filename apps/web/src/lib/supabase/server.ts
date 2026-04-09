import { cookies } from "next/headers";

const USERS = {
  freelancer: {
    id: "static-freelancer-user",
    email: "freelancer@hiresense.in",
    user_metadata: {
      display_name: "Arjun Sharma",
      full_name: "Arjun Sharma",
      avatar_url: null,
    },
    phone: null,
  },
  employer: {
    id: "static-employer-user",
    email: "employer@hiresense.in",
    user_metadata: {
      display_name: "TechVenture Solutions",
      full_name: "Priya Menon",
      avatar_url: null,
    },
    phone: null,
  },
};

export const STATIC_USER_ID = "static-freelancer-user";
export const STATIC_USER = USERS.freelancer;

export async function createClient() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("hiresense-auth");
  const username = authCookie?.value as keyof typeof USERS | undefined;
  const currentUser = username ? USERS[username] ?? null : null;

  return {
    auth: {
      getUser: async () => ({
        data: { user: currentUser },
        error: currentUser ? null : { message: "Not authenticated" },
      }),
      signOut: async () => ({ error: null }),
    },
  // eslint-disable-next-line
  } as any;
}
