import { prisma } from "@hiresense/db";
import { Sidebar } from "@/components/layout/sidebar";
import { getMyProfile } from "@/server/actions/profile.actions";
import { FreelancerProfileClient } from "./client";

export default async function FreelancerProfilePage() {
  const [profile, skills] = await Promise.all([
    getMyProfile(),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  ]);

  const freelancerProfile = profile?.freelancerProfile;

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 max-w-5xl">
        <FreelancerProfileClient
          initialSkills={skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            category: skill.category,
          }))}
          initialProfile={
            freelancerProfile
              ? {
                  displayName: freelancerProfile.displayName || "",
                  headline: freelancerProfile.headline || "",
                  bio: freelancerProfile.bio || "",
                  hourlyRate: freelancerProfile.hourlyRate
                    ? String(freelancerProfile.hourlyRate)
                    : "",
                  city: freelancerProfile.city || "",
                  state: freelancerProfile.state || "",
                  isRemote: freelancerProfile.isRemote,
                  githubUrl: freelancerProfile.githubUrl || "",
                  behanceUrl: freelancerProfile.behanceUrl || "",
                  dribbbleUrl: freelancerProfile.dribbbleUrl || "",
                  linkedinUrl: freelancerProfile.linkedinUrl || "",
                  upiId: freelancerProfile.upiId || "",
                  bankAccountNumber: freelancerProfile.bankAccountNumber || "",
                  bankIfsc: freelancerProfile.bankIfsc || "",
                  bankName: freelancerProfile.bankName || "",
                  selectedSkillIds: freelancerProfile.skills.map((entry) => entry.skillId),
                }
              : {
                  displayName: "",
                  headline: "",
                  bio: "",
                  hourlyRate: "",
                  city: "",
                  state: "",
                  isRemote: true,
                  githubUrl: "",
                  behanceUrl: "",
                  dribbbleUrl: "",
                  linkedinUrl: "",
                  upiId: "",
                  bankAccountNumber: "",
                  bankIfsc: "",
                  bankName: "",
                  selectedSkillIds: [],
                }
          }
        />
      </main>
    </>
  );
}
