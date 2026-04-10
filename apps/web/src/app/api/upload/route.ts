import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser, jsonError } from "@/app/api/_lib/auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "text/plain",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const BUCKET = "uploads";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return jsonError("Invalid form data", 400);
  }

  const file = formData.get("file") as File | null;
  if (!file) return jsonError("No file provided", 400);
  if (file.size > MAX_SIZE) return jsonError("File too large (max 10 MB)", 400);
  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonError("File type not allowed", 400);
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return jsonError(error.message, 500);
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return Response.json({ url: publicUrl, path });
}
