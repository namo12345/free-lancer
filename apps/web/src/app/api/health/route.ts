export async function GET() {
  return Response.json({ status: "ok", service: "hiresense", timestamp: new Date().toISOString() });
}
