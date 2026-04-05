import { cookies } from "next/headers";

const STATIC_USER_ID = "static-admin-user";
const STATIC_USER = {
  id: STATIC_USER_ID,
  email: "admin@hiresense.in",
  user_metadata: {
    display_name: "Admin",
    full_name: "Admin User",
    avatar_url: null,
  },
  phone: null,
};

export async function createClient() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("hiresense-auth");
  const isAuthenticated = authCookie?.value === "admin";

  return {
    auth: {
      getUser: async () => ({
        data: {
          user: isAuthenticated ? STATIC_USER : null,
        },
        error: isAuthenticated ? null : { message: "Not authenticated" },
      }),
      signOut: async () => ({ error: null }),
    },
  // eslint-disable-next-line
  } as any;
}

export { STATIC_USER_ID, STATIC_USER };
