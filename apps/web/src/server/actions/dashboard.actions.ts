"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

type MonthlyPoint = {
  label: string;
  value: number;
};

type SkillGap = {
  skill: string;
  demandScore: number;
  jobMatchIncrease: number;
  difficulty: "easy" | "moderate" | "hard";
  reason: string;
};

type TalentSnapshotRow = {
  city: string;
  freelancers: number;
  avgRate: number;
  topSkill: string;
};

type DisputeItem = {
  id: string;
  gigId: string;
  gigTitle: string;
  freelancerName: string;
  reason: string;
  status: "OPEN" | "REVIEWED";
  createdAt: string;
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toString" in value) {
    return Number(value.toString());
  }
  return 0;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function getRollingMonths(count = 6, end = new Date()) {
  const months: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - i, 1));
    months.push({
      key: monthKey(date),
      label: monthLabel(date),
    });
  }
  return months;
}

async function getCurrentDbUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      freelancerProfile: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      },
      employerProfile: true,
    },
  });
}

function buildMonthlySeries(
  months: { key: string; label: string }[],
  entries: { date: Date | null; value: number }[]
): MonthlyPoint[] {
  return months.map((month) => {
    const total = entries.reduce((sum, entry) => {
      if (!entry.date) return sum;
      return monthKey(entry.date) === month.key ? sum + entry.value : sum;
    }, 0);

    return { label: month.label, value: total };
  });
}

function buildMonthlyRatioSeries(
  months: { key: string; label: string }[],
  entries: { date: Date; status: string }[]
): MonthlyPoint[] {
  return months.map((month) => {
    const monthEntries = entries.filter((entry) => monthKey(entry.date) === month.key);
    if (monthEntries.length === 0) {
      return { label: month.label, value: 0 };
    }

    const accepted = monthEntries.filter((entry) => entry.status === "ACCEPTED").length;
    return {
      label: month.label,
      value: Math.round((accepted / monthEntries.length) * 100),
    };
  });
}

export async function getFreelancerDashboardData() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser?.freelancerProfile) return null;

  const months = getRollingMonths();
  const [paidInvoices, bids, completedGigs, pendingInvoices, activeGigs, recentBids, openGigs] =
    await Promise.all([
      prisma.invoice.findMany({
        where: { freelancerId: dbUser.id, status: "PAID" },
        select: { totalAmount: true, paidAt: true, createdAt: true },
      }),
      prisma.bid.findMany({
        where: { freelancerId: dbUser.id },
        select: { createdAt: true, status: true, amount: true, id: true, gig: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.gig.count({
        where: {
          status: "COMPLETED",
          bids: { some: { freelancerId: dbUser.id, status: "ACCEPTED" } },
        },
      }),
      prisma.invoice.count({
        where: { freelancerId: dbUser.id, status: "SENT" },
      }),
      prisma.gig.findMany({
        where: {
          status: "IN_PROGRESS",
          bids: { some: { freelancerId: dbUser.id, status: "ACCEPTED" } },
        },
        include: {
          poster: { include: { employerProfile: true } },
          milestones: true,
        },
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.bid.findMany({
        where: { freelancerId: dbUser.id },
        include: { gig: { select: { title: true, id: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.gig.findMany({
        where: { status: "OPEN" },
        include: {
          skills: { include: { skill: true } },
        },
        take: 100,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const skillNames = new Set(
    dbUser.freelancerProfile.skills.map((entry) => entry.skill.name.toLowerCase())
  );
  const skillDemand = new Map<string, number>();

  for (const gig of openGigs) {
    for (const skill of gig.skills) {
      const name = skill.skill.name;
      if (skillNames.has(name.toLowerCase())) continue;
      skillDemand.set(name, (skillDemand.get(name) || 0) + 1);
    }
  }

  const maxDemand = Math.max(1, ...skillDemand.values());
  const skillGaps: SkillGap[] = Array.from(skillDemand.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill, demandCount]) => ({
      skill,
      demandScore: Math.min(100, Math.round((demandCount / maxDemand) * 100)),
      jobMatchIncrease: Math.min(40, demandCount * 4),
      difficulty: demandCount >= 10 ? "hard" : demandCount >= 5 ? "moderate" : "easy",
      reason: `${demandCount} open gig${demandCount === 1 ? "" : "s"} currently mention this skill, and it is not yet on your profile.`,
    }));

  const monthlyEarnings = buildMonthlySeries(
    months,
    paidInvoices.map((invoice) => ({
      date: invoice.paidAt ?? invoice.createdAt,
      value: toNumber(invoice.totalAmount),
    }))
  );

  const monthlyBidSuccess = buildMonthlyRatioSeries(
    months,
    bids.map((bid) => ({
      date: bid.createdAt,
      status: bid.status,
    }))
  );

  const avgRating = dbUser.freelancerProfile?.avgRating || 0;
  const responseTime = dbUser.freelancerProfile?.responseTime || 0;

  return {
    stats: {
      totalEarnings: paidInvoices.reduce((sum, invoice) => sum + toNumber(invoice.totalAmount), 0),
      activeBids: bids.filter((bid) => bid.status === "PENDING").length,
      completedGigs,
      avgRating,
      pendingInvoices,
      responseTime,
    },
    monthlyEarnings,
    monthlyBidSuccess,
    skillGaps,
    activeGigs: activeGigs.map((gig) => ({
      id: gig.id,
      title: gig.title,
      client:
        gig.poster?.employerProfile?.displayName ||
        gig.poster?.email ||
        "Unknown",
      budget: toNumber(gig.budgetMax) || toNumber(gig.budgetMin) || 0,
      deadline: gig.deadline?.toISOString() || null,
      milestonesTotal: gig.milestones.length,
      milestonesCompleted: gig.milestones.filter((milestone) => milestone.status === "APPROVED").length,
    })),
    recentBids: recentBids.map((bid) => ({
      id: bid.id,
      gigId: bid.gig.id,
      gigTitle: bid.gig.title,
      amount: toNumber(bid.amount),
      status: bid.status,
      createdAt: bid.createdAt.toISOString(),
    })),
  };
}

export async function getEmployerDashboardData() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser?.employerProfile) return null;

  const months = getRollingMonths();
  const [paidInvoices, postedGigs, recentGigs, recentNotifications, freelancerProfiles] =
    await Promise.all([
      prisma.invoice.findMany({
        where: { employerId: dbUser.id, status: "PAID" },
        select: { totalAmount: true, paidAt: true, createdAt: true },
      }),
      prisma.gig.findMany({
        where: { posterId: dbUser.id },
        select: { id: true, status: true },
      }),
      prisma.gig.findMany({
        where: { posterId: dbUser.id },
        include: {
          _count: { select: { bids: true } },
          skills: { include: { skill: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.findMany({
        where: { userId: dbUser.id },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.freelancerProfile.findMany({
        where: {
          city: { not: null },
        },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      }),
    ]);

  const openGigs = postedGigs.filter((gig) => gig.status === "OPEN").length;
  const inProgressGigs = postedGigs.filter((gig) => gig.status === "IN_PROGRESS").length;
  const totalGigs = postedGigs.length;
  const pendingBids = await prisma.bid.count({
    where: {
      status: "PENDING",
      gigId: { in: postedGigs.map((gig) => gig.id) },
    },
  });

  const monthlySpending = buildMonthlySeries(
    months,
    paidInvoices.map((invoice) => ({
      date: invoice.paidAt ?? invoice.createdAt,
      value: toNumber(invoice.totalAmount),
    }))
  );

  const cityMap = new Map<
    string,
    { freelancers: number; rateTotal: number; rateCount: number; skills: Map<string, number> }
  >();

  for (const profile of freelancerProfiles) {
    if (!profile.city) continue;

    const bucket =
      cityMap.get(profile.city) ||
      { freelancers: 0, rateTotal: 0, rateCount: 0, skills: new Map<string, number>() };

    bucket.freelancers += 1;
    if (profile.hourlyRate) {
      bucket.rateTotal += toNumber(profile.hourlyRate);
      bucket.rateCount += 1;
    }

    for (const skill of profile.skills) {
      bucket.skills.set(skill.skill.name, (bucket.skills.get(skill.skill.name) || 0) + 1);
    }

    cityMap.set(profile.city, bucket);
  }

  const talentSnapshot: TalentSnapshotRow[] = Array.from(cityMap.entries())
    .map(([city, bucket]) => {
      const topSkill = Array.from(bucket.skills.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "Generalist";
      return {
        city,
        freelancers: bucket.freelancers,
        avgRate: bucket.rateCount > 0 ? Math.round(bucket.rateTotal / bucket.rateCount) : 0,
        topSkill,
      };
    })
    .sort((a, b) => b.freelancers - a.freelancers || b.avgRate - a.avgRate)
    .slice(0, 6);

  return {
    stats: {
      totalSpent: paidInvoices.reduce((sum, invoice) => sum + toNumber(invoice.totalAmount), 0),
      openGigs,
      inProgressGigs,
      activeGigs: openGigs + inProgressGigs,
      pendingBids,
      totalGigs,
    },
    monthlySpending,
    talentSnapshot,
    recentGigs: recentGigs.map((gig) => ({
      id: gig.id,
      title: gig.title,
      status: gig.status,
      budgetMin: toNumber(gig.budgetMin),
      budgetMax: toNumber(gig.budgetMax),
      bidCount: gig._count.bids,
      createdAt: gig.createdAt.toISOString(),
    })),
    recentActivity: recentNotifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      text: notification.body || notification.title,
      time: notification.createdAt.toISOString(),
    })),
  };
}

export async function getMyGigs(page = 1, limit = 10) {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return { data: [], total: 0, page, totalPages: 0 };

  const where = { posterId: dbUser.id };

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      include: { _count: { select: { bids: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.gig.count({ where }),
  ]);

  return {
    data: gigs.map((gig) => ({
      id: gig.id,
      title: gig.title,
      status: gig.status,
      budgetMin: toNumber(gig.budgetMin),
      budgetMax: toNumber(gig.budgetMax),
      bidCount: gig._count.bids,
      createdAt: gig.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getMyBids(page = 1, limit = 10) {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return { data: [], total: 0, page, totalPages: 0 };

  const where = { freelancerId: dbUser.id };

  const [bids, total] = await Promise.all([
    prisma.bid.findMany({
      where,
      include: { gig: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.bid.count({ where }),
  ]);

  return {
    data: bids.map((bid) => ({
      id: bid.id,
      gig: { id: bid.gig.id, title: bid.gig.title },
      amount: toNumber(bid.amount),
      deliveryDays: bid.deliveryDays,
      status: bid.status,
      matchScore: bid.matchScore || 0,
      createdAt: bid.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getMyInvoices(page = 1, limit = 10) {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return { data: [], total: 0, page, totalPages: 0 };

  const isEmployer = dbUser.role === "EMPLOYER";
  const where = isEmployer
    ? { employerId: dbUser.id }
    : { freelancerId: dbUser.id };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        gig: { select: { title: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  const userIds = new Set<string>();
  for (const invoice of invoices) {
    userIds.add(invoice.employerId);
    userIds.add(invoice.freelancerId);
  }

  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    include: {
      freelancerProfile: { select: { displayName: true } },
      employerProfile: { select: { displayName: true } },
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  return {
    data: invoices.map((invoice) => {
      const employer = userMap.get(invoice.employerId);
      const freelancer = userMap.get(invoice.freelancerId);

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        gigTitle: invoice.gig?.title || "Untitled Gig",
        employerName:
          employer?.employerProfile?.displayName ||
          employer?.email ||
          "Unknown",
        freelancerName:
          freelancer?.freelancerProfile?.displayName ||
          freelancer?.email ||
          "Unknown",
        totalAmount: toNumber(invoice.totalAmount),
        status: invoice.status,
        dueDate: invoice.dueDate?.toISOString() || null,
        paidAt: invoice.paidAt?.toISOString() || null,
        createdAt: invoice.createdAt.toISOString(),
      };
    }),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getEmployerDisputesData() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser?.employerProfile) return null;

  const [notifications, gigs] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId: dbUser.id,
        type: "dispute_flagged",
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gig.findMany({
      where: {
        posterId: dbUser.id,
      },
      include: {
        bids: {
          where: { status: "ACCEPTED" },
          include: {
            freelancer: {
              include: {
                freelancerProfile: {
                  select: { displayName: true },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const gigMap = new Map(
    gigs.map((gig) => [
      gig.id,
      {
        title: gig.title,
        freelancerName:
          gig.bids[0]?.freelancer.freelancerProfile?.displayName ||
          gig.bids[0]?.freelancer.email ||
          "Unknown freelancer",
      },
    ])
  );

  const disputes: DisputeItem[] = notifications.map((notification) => {
    const data = notification.data as {
      gigId?: string;
      reason?: string;
    } | null;

    const gigId = data?.gigId || "";
    const gig = gigMap.get(gigId);

    return {
      id: notification.id,
      gigId,
      gigTitle: gig?.title || "Unknown gig",
      freelancerName: gig?.freelancerName || "Unknown freelancer",
      reason: data?.reason || notification.body || notification.title,
      status: notification.isRead ? "REVIEWED" : "OPEN",
      createdAt: notification.createdAt.toISOString(),
    };
  });

  return { disputes };
}

const getCachedAdminStats = unstable_cache(
  async () => {
    const [totalUsers, freelancerCount, employerCount, gmv, gigCount, invoiceCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "FREELANCER" } }),
        prisma.user.count({ where: { role: "EMPLOYER" } }),
        prisma.invoice.aggregate({
          where: { status: "PAID" },
          _sum: { totalAmount: true },
        }),
        prisma.gig.count(),
        prisma.invoice.count({ where: { status: "PAID" } }),
      ]);
    return { totalUsers, freelancerCount, employerCount, gmv, gigCount, invoiceCount };
  },
  ["admin-stats"],
  { revalidate: 30 }
);

export async function getAdminDashboardData() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser || dbUser.role !== "ADMIN") return null;

  const [cachedStats, activeDisputes, recentUsers, recentNotifications] =
    await Promise.all([
      getCachedAdminStats(),
      prisma.notification.count({ where: { type: "dispute_flagged", isRead: false } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { freelancerProfile: true, employerProfile: true },
      }),
      prisma.notification.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return {
    stats: {
      totalUsers: cachedStats.totalUsers,
      freelancerCount: cachedStats.freelancerCount,
      employerCount: cachedStats.employerCount,
      gmv: toNumber(cachedStats.gmv._sum.totalAmount) || 0,
      activeDisputes,
    },
    recentUsers: recentUsers.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      name:
        user.freelancerProfile?.displayName ||
        user.employerProfile?.displayName ||
        user.email,
      createdAt: user.createdAt.toISOString(),
    })),
    recentActivity: recentNotifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      text: notification.body || notification.title,
      time: notification.createdAt.toISOString(),
    })),
  };
}

export async function getPublicProfile(userId: string) {
  const profile = await prisma.freelancerProfile.findFirst({
    where: { OR: [{ id: userId }, { userId }] },
    include: {
      user: { select: { email: true } },
      skills: { include: { skill: true } },
      portfolioItems: { take: 10, orderBy: { createdAt: "desc" } },
      badges: true,
    },
  });

  if (!profile) return null;

  return {
    displayName: profile.displayName,
    headline: profile.headline,
    bio: profile.bio,
    city: profile.city,
    state: profile.state,
    hourlyRate: Number(profile.hourlyRate) || 0,
    avgRating: Number(profile.avgRating) || 0,
    completedGigs: profile.completedGigs,
    totalEarnings: Number(profile.totalEarnings) || 0,
    skills: profile.skills.map((entry) => entry.skill.name),
    githubUrl: profile.githubUrl,
    portfolioItems: profile.portfolioItems,
    badges: profile.badges,
  };
}

export async function getConversationsForUser() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return [];

  const conversations = await prisma.conversation.findMany({
    where: { participantIds: { has: dbUser.id } },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  const enriched = await Promise.all(
    conversations.map(async (conversation) => {
      const otherUserId =
        conversation.participantIds.find((id) => id !== dbUser.id) ||
        conversation.participantIds[0];
      const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        include: { freelancerProfile: true, employerProfile: true },
      });
      const lastMessage = conversation.messages[0];

      return {
        id: conversation.id,
        otherUser: {
          id: otherUserId,
          displayName:
            otherUser?.freelancerProfile?.displayName ||
            otherUser?.employerProfile?.displayName ||
            otherUser?.email ||
            "Unknown",
          avatarUrl:
            otherUser?.freelancerProfile?.avatarUrl ||
            otherUser?.employerProfile?.avatarUrl ||
            undefined,
        },
        gigTitle: conversation.gigId
          ? (
              await prisma.gig.findUnique({
                where: { id: conversation.gigId },
                select: { title: true },
              })
            )?.title
          : undefined,
        lastMessage: lastMessage?.content || "",
        lastMessageAt:
          conversation.lastMessageAt?.toISOString() || conversation.createdAt.toISOString(),
        unreadCount: await prisma.message.count({
          where: {
            conversationId: conversation.id,
            receiverId: dbUser.id,
            isRead: false,
          },
        }),
      };
    })
  );

  return enriched;
}

export async function getMyReviewsData() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return null;

  const reviews = await prisma.review.findMany({
    where: { targetId: dbUser.id },
    include: {
      author: {
        select: {
          freelancerProfile: {
            select: { displayName: true, avatarUrl: true },
          },
          employerProfile: {
            select: { displayName: true, avatarUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const gigIds = [...new Set(reviews.map((review) => review.gigId))];
  const gigs = await prisma.gig.findMany({
    where: { id: { in: gigIds } },
    select: { id: true, title: true },
  });
  const gigMap = new Map(gigs.map((gig) => [gig.id, gig.title]));

  const profile = dbUser.freelancerProfile;
  const hasBadges = profile
    ? await prisma.skillBadge.count({ where: { freelancerId: profile.id } })
    : 0;

  return {
    reviews: reviews.map((review) => ({
      id: review.id,
      authorName:
        review.author.employerProfile?.displayName ||
        review.author.freelancerProfile?.displayName ||
        "Anonymous",
      authorAvatarUrl:
        review.author.employerProfile?.avatarUrl ||
        review.author.freelancerProfile?.avatarUrl ||
        undefined,
      gigTitle: gigMap.get(review.gigId) || "Untitled Gig",
      rating: review.rating,
      communicationRating: review.communicationRating || undefined,
      qualityRating: review.qualityRating || undefined,
      timelinessRating: review.timelinessRating || undefined,
      comment: review.comment || undefined,
      createdAt: review.createdAt.toISOString(),
    })),
    trustScore: {
      score: Math.round((Number(profile?.avgRating || 0) / 5) * 100),
      completedGigs: profile?.completedGigs || 0,
      avgRating: Number(profile?.avgRating || 0),
      isVerified: hasBadges > 0,
      responseTime: profile?.responseTime || 0,
    },
  };
}
