import {
  Clan,
  ClanQueryOptions,
  createClan,
  getAllClans,
  searchClans,
} from "@/services/clanService";

/**
 * GET /api/clans
 *
 * Supports optional query parameters for search / filtering:
 * - q: text search across name / house / branch
 * - region: one or more region values (multiple params or comma-separated)
 * - branch: one or more branch values
 * - lineage_type: one or more lineage type values
 *
 * Examples:
 * - /api/clans          → all clans
 * - /api/clans?q=zulu   → text search
 * - /api/clans?region=KZN&region=Gauteng
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const text = searchParams.get("q") ?? undefined;

    const parseMulti = (key: string): string[] => {
      const values = searchParams.getAll(key);
      const split = values
        .map((v) => v.split(","))
        .flat()
        .map((v) => v.trim())
        .filter(Boolean);
      return Array.from(new Set(split));
    };

    const regions = parseMulti("region");
    const branches = parseMulti("branch");
    const lineageTypes = parseMulti("lineage_type");

    const options: ClanQueryOptions = {};
    if (text) options.text = text;
    if (regions.length) options.regions = regions;
    if (branches.length) options.branches = branches;
    if (lineageTypes.length) options.lineageTypes = lineageTypes;

    const hasFilters =
      options.text ||
      options.regions ||
      options.branches ||
      options.lineageTypes;

    const clans = hasFilters ? await searchClans(options) : await getAllClans();
    return Response.json(clans);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch clans" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clans
 *
 * Create or overwrite a clan document. Expects a full Clan payload in the body.
 */
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
