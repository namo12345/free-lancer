import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  // Web Development
  { name: "React", slug: "react", category: "Web Development" },
  { name: "Next.js", slug: "nextjs", category: "Web Development" },
  { name: "Vue.js", slug: "vuejs", category: "Web Development" },
  { name: "Angular", slug: "angular", category: "Web Development" },
  { name: "Node.js", slug: "nodejs", category: "Web Development" },
  { name: "Express.js", slug: "expressjs", category: "Web Development" },
  { name: "TypeScript", slug: "typescript", category: "Web Development" },
  { name: "JavaScript", slug: "javascript", category: "Web Development" },
  { name: "HTML/CSS", slug: "html-css", category: "Web Development" },
  { name: "Tailwind CSS", slug: "tailwind-css", category: "Web Development" },
  { name: "PHP", slug: "php", category: "Web Development" },
  { name: "Laravel", slug: "laravel", category: "Web Development" },
  { name: "Django", slug: "django", category: "Web Development" },
  { name: "FastAPI", slug: "fastapi", category: "Web Development" },
  { name: "Ruby on Rails", slug: "ruby-on-rails", category: "Web Development" },
  { name: "WordPress", slug: "wordpress", category: "Web Development" },

  // Mobile Development
  { name: "React Native", slug: "react-native", category: "Mobile Development" },
  { name: "Flutter", slug: "flutter", category: "Mobile Development" },
  { name: "Swift", slug: "swift", category: "Mobile Development" },
  { name: "Kotlin", slug: "kotlin", category: "Mobile Development" },
  { name: "iOS Development", slug: "ios-development", category: "Mobile Development" },
  { name: "Android Development", slug: "android-development", category: "Mobile Development" },

  // UI/UX Design
  { name: "Figma", slug: "figma", category: "UI/UX Design" },
  { name: "Adobe XD", slug: "adobe-xd", category: "UI/UX Design" },
  { name: "Sketch", slug: "sketch", category: "UI/UX Design" },
  { name: "UI Design", slug: "ui-design", category: "UI/UX Design" },
  { name: "UX Research", slug: "ux-research", category: "UI/UX Design" },
  { name: "Wireframing", slug: "wireframing", category: "UI/UX Design" },
  { name: "Prototyping", slug: "prototyping", category: "UI/UX Design" },

  // Graphic Design
  { name: "Adobe Photoshop", slug: "photoshop", category: "Graphic Design" },
  { name: "Adobe Illustrator", slug: "illustrator", category: "Graphic Design" },
  { name: "Logo Design", slug: "logo-design", category: "Graphic Design" },
  { name: "Brand Identity", slug: "brand-identity", category: "Graphic Design" },
  { name: "Canva", slug: "canva", category: "Graphic Design" },

  // Content Writing
  { name: "Blog Writing", slug: "blog-writing", category: "Content Writing" },
  { name: "Copywriting", slug: "copywriting", category: "Content Writing" },
  { name: "SEO Writing", slug: "seo-writing", category: "Content Writing" },
  { name: "Technical Writing", slug: "technical-writing", category: "Content Writing" },
  { name: "Content Strategy", slug: "content-strategy", category: "Content Writing" },

  // Video Editing
  { name: "Adobe Premiere Pro", slug: "premiere-pro", category: "Video Editing" },
  { name: "After Effects", slug: "after-effects", category: "Video Editing" },
  { name: "DaVinci Resolve", slug: "davinci-resolve", category: "Video Editing" },
  { name: "Video Production", slug: "video-production", category: "Video Editing" },
  { name: "Motion Graphics", slug: "motion-graphics", category: "Video Editing" },

  // Digital Marketing
  { name: "SEO", slug: "seo", category: "Digital Marketing" },
  { name: "Google Ads", slug: "google-ads", category: "Digital Marketing" },
  { name: "Facebook Ads", slug: "facebook-ads", category: "Digital Marketing" },
  { name: "Social Media Marketing", slug: "social-media-marketing", category: "Digital Marketing" },
  { name: "Email Marketing", slug: "email-marketing", category: "Digital Marketing" },
  { name: "Analytics", slug: "analytics", category: "Digital Marketing" },

  // Data Science
  { name: "Python", slug: "python", category: "Data Science" },
  { name: "R", slug: "r-language", category: "Data Science" },
  { name: "SQL", slug: "sql", category: "Data Science" },
  { name: "Pandas", slug: "pandas", category: "Data Science" },
  { name: "Data Visualization", slug: "data-visualization", category: "Data Science" },
  { name: "Machine Learning", slug: "machine-learning", category: "Data Science" },
  { name: "Deep Learning", slug: "deep-learning", category: "Data Science" },
  { name: "NLP", slug: "nlp", category: "Data Science" },

  // AI/ML
  { name: "TensorFlow", slug: "tensorflow", category: "AI/ML" },
  { name: "PyTorch", slug: "pytorch", category: "AI/ML" },
  { name: "LangChain", slug: "langchain", category: "AI/ML" },
  { name: "OpenAI API", slug: "openai-api", category: "AI/ML" },
  { name: "Computer Vision", slug: "computer-vision", category: "AI/ML" },
  { name: "LLM Fine-tuning", slug: "llm-fine-tuning", category: "AI/ML" },

  // DevOps
  { name: "Docker", slug: "docker", category: "DevOps" },
  { name: "Kubernetes", slug: "kubernetes", category: "DevOps" },
  { name: "AWS", slug: "aws", category: "DevOps" },
  { name: "GCP", slug: "gcp", category: "DevOps" },
  { name: "Azure", slug: "azure", category: "DevOps" },
  { name: "CI/CD", slug: "ci-cd", category: "DevOps" },
  { name: "Linux", slug: "linux", category: "DevOps" },
  { name: "Terraform", slug: "terraform", category: "DevOps" },

  // Blockchain
  { name: "Solidity", slug: "solidity", category: "Blockchain" },
  { name: "Web3.js", slug: "web3js", category: "Blockchain" },
  { name: "Smart Contracts", slug: "smart-contracts", category: "Blockchain" },
  { name: "DeFi", slug: "defi", category: "Blockchain" },

  // Databases
  { name: "PostgreSQL", slug: "postgresql", category: "Databases" },
  { name: "MongoDB", slug: "mongodb", category: "Databases" },
  { name: "MySQL", slug: "mysql", category: "Databases" },
  { name: "Redis", slug: "redis", category: "Databases" },
  { name: "Firebase", slug: "firebase", category: "Databases" },
  { name: "Supabase", slug: "supabase", category: "Databases" },
];

async function main() {
  console.log("Seeding skills...");

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: skill,
    });
  }

  console.log(`Seeded ${skills.length} skills.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
