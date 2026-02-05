import { Clan, createClan, getAllClans } from "@/services/clanService";


// GET /api/clans
export async function GET() {
  try {
    const clans = await getAllClans();
    return Response.json(clans);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch clans" },
      { status: 500 }
    );
  }
}

// POST /api/clans
export async function POST(request: Request) {
  try {
    const body: Clan = await request.json();
    await createClan(body);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to create clan" },
      { status: 500 }
    );
  }
}
