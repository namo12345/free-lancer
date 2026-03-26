export const UserRole = {
  FREELANCER: "FREELANCER",
  EMPLOYER: "EMPLOYER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const GigStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type GigStatus = (typeof GigStatus)[keyof typeof GigStatus];

export const BidStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type BidStatus = (typeof BidStatus)[keyof typeof BidStatus];

export const MilestoneStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
} as const;
export type MilestoneStatus = (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

export const InvoiceStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const VerificationStatus = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const Language = {
  EN: "EN",
  HI: "HI",
  TA: "TA",
  TE: "TE",
  BN: "BN",
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const GigCategory = {
  WEB_DEVELOPMENT: "Web Development",
  MOBILE_DEVELOPMENT: "Mobile Development",
  UI_UX_DESIGN: "UI/UX Design",
  GRAPHIC_DESIGN: "Graphic Design",
  CONTENT_WRITING: "Content Writing",
  VIDEO_EDITING: "Video Editing",
  DIGITAL_MARKETING: "Digital Marketing",
  DATA_SCIENCE: "Data Science",
  AI_ML: "AI/ML",
  DEVOPS: "DevOps",
  BLOCKCHAIN: "Blockchain",
  GAME_DEVELOPMENT: "Game Development",
  OTHER: "Other",
} as const;
export type GigCategory = (typeof GigCategory)[keyof typeof GigCategory];

export const ExperienceLevel = {
  ENTRY: "Entry",
  INTERMEDIATE: "Intermediate",
  EXPERT: "Expert",
} as const;
export type ExperienceLevel = (typeof ExperienceLevel)[keyof typeof ExperienceLevel];

export const BudgetType = {
  FIXED: "fixed",
  HOURLY: "hourly",
} as const;
export type BudgetType = (typeof BudgetType)[keyof typeof BudgetType];
