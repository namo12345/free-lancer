import { Sidebar } from "@/components/layout/sidebar";
import { getMyProfile } from "@/server/actions/profile.actions";
import { EmployerProfileClient } from "./client";

export default async function EmployerProfilePage() {
  const profile = await getMyProfile();
  const employerProfile = profile?.employerProfile;

  return (
    <>
      <Sidebar role="employer" />
      <main className="flex-1 p-6 max-w-5xl">
        <EmployerProfileClient
          initialProfile={
            employerProfile
              ? {
                  displayName: employerProfile.displayName || "",
                  companyName: employerProfile.companyName || "",
                  bio: employerProfile.bio || "",
                  website: employerProfile.website || "",
                  industry: employerProfile.industry || "",
                  city: employerProfile.city || "",
                  state: employerProfile.state || "",
                }
              : {
                  displayName: "",
                  companyName: "",
                  bio: "",
                  website: "",
                  industry: "",
                  city: "",
                  state: "",
                }
          }
        />
      </main>
    </>
  );
}
