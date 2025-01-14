import "server-only";
import ky from "ky";
import { env } from "@/env";

export const notusApi = ky.create({
	prefixUrl: "https://api.notuslabs.xyz/api/v1",
	headers: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		"X-API-KEY": env.NOTUS_API_KEY!,
	},
});
