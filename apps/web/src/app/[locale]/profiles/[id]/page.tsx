import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { formatCurrency } from "@/lib/utils";

// In production: fetch from DB using params.id
const mockProfile = {
  displayName: "Priya Sharma",
  headline: "Full-Stack Developer | React & Node.js Expert",
  bio: "5+ years building scalable web applications for startups. Specialized in React, Next.js, and Node.js. Based in Bangalore.",
  city: "Bangalore",
  state: "Karnataka",
  hourlyRate: 1500,
  avgRating: 4.8,
  completedGigs: 24,
  totalEarnings: 350000,
  skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  githubUrl: "https://github.com/priyasharma",
};

export default function PublicProfilePage() {
  const profile = mockProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar fallback={profile.displayName} size="lg" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                <p className="text-muted-foreground">{profile.headline}</p>
                <p className="text-sm text-gray-500 mt-1">{profile.city}, {profile.state}</p>
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-lg font-bold">{profile.avgRating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{profile.completedGigs}</div>
                    <div className="text-xs text-muted-foreground">Gigs Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{formatCurrency(profile.hourlyRate)}/hr</div>
                    <div className="text-xs text-muted-foreground">Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="mb-6">
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent><p className="text-gray-700">{profile.bio}</p></CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
