import { getProviderStatus } from "@/lib/data-sources/status";
import { NextResponse } from "next/server";

/** Dev/ops endpoint: which data layers are mock vs API, and last sync. */
export async function GET() {
  return NextResponse.json({
    app: "matchradar",
    ok: true,
    providers: getProviderStatus(),
  });
}
