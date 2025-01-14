import { getAccountAbstraction } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export function useAccountAbstraction() {
	const { address, isConnected } = useAccount();

	return useQuery({
		enabled: isConnected,
		queryKey: ["accountAbstraction", address],
		queryFn: async () => {
			if (!address) return;

			// uses nextjs' server actions (nextjs 14 only)
			// but you could replace this by using a fetch request to call your own api
			return await getAccountAbstraction(address);
		},
	});
}
