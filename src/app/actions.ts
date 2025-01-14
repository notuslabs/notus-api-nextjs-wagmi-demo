"use server";
import { notusApi } from "@/lib/notus";

// calls Notus API to get the account abstraction for EOA (a simple wallet like metamask)
// watch out that this can be called by anyone, so make sure to add your own auth layer or rate limits
export const getAccountAbstraction = async (address: `0x${string}`) => {
	// we could replace this to use orval.dev to automatically generate the api calls from the swagger file
	// which is available in our docs at https://docs.notus.team/reference but for now this is more than enough
	const data = await notusApi
		.get(
			`wallets/address?externallyOwnedAccount=${address}&factory=0x00004EC70002a32400f8ae005A26081065620D20&salt=0`,
		)
		.json<{ wallet: { accountAbstraction: string } }>();

	return data;
};
