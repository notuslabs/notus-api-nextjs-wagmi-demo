import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export function useAccountAbstraction() {
	const { address, isConnected } = useAccount();

	return useQuery({
		enabled: isConnected,
		queryKey: ["accountAbstraction", address],
		queryFn: async () => {
			if (!address) return;

			return await api
				.get(`get-account-abstraction?address=${address}`)
				.json<{ wallet: { accountAbstraction: string } }>();
		},
	});
}
