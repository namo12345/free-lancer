import { notFound } from "next/navigation";
import { getPublicProfile } from "@/server/actions/dashboard.actions";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { formatCurrency } from "@/lib/utils";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) notFound();

  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : null;
  const totalEarnings = profile.totalEarnings
    ? Number(profile.totalEarnings)
    : 0;

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
                {profile.headline && (
                  <p className="text-muted-foreground">{profile.headline}</p>
                )}
                {(profile.city || profile.state) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {[profile.city, profile.state].filter(Boolean).join(", ")}
                  </p>
                )}
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {profile.avgRating || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {profile.completedGigs}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gigs Done
                    </div>
                  </div>
                  {hourlyRate && hourlyRate > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {formatCurrency(hourlyRate)}/hr
                      </div>
                      <div className="text-xs text-muted-foreground">Rate</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {profile.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg"
                  >
                    <span className="text-sm font-medium text-brand-800">
                      {badge.skillName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {badge.badgeType}
                    </Badge>
                    {badge.score != null && (
                      <span className="text-xs text-muted-foreground">
                        {badge.score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio */}
        {profile.portfolioItems && profile.portfolioItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:underline mt-2 inline-block"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links */}
        {profile.githubUrl && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-600 hover:underline"
              >
                GitHub Profile
              </a>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
