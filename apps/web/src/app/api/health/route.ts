export async function GET() {
  return Response.json({ status: "ok", service: "baseedwork", timestamp: new Date().toISOString() });
}
