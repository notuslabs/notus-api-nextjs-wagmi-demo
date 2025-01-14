import type { NextRequest } from "next/server";

import { notusApi } from "@/lib/notus";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const address = request.nextUrl.searchParams.get("address");

	if (!address) {
		return NextResponse.json({ error: "Address is required" }, { status: 400 });
	}

	const data = await notusApi
		.get(
			`wallets/address?externallyOwnedAccount=${address}&factory=0x00004EC70002a32400f8ae005A26081065620D20&salt=0`,
		)
		.json();

	return NextResponse.json(data);
}
