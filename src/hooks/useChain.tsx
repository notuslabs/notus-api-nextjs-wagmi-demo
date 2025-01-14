import { chains } from "@/config";
import { NetworkPolygonPos } from "@web3icons/react";
import { polygon, polygonAmoy } from "viem/chains";
import { useChainId } from "wagmi";

export function useChain() {
	const chainId = useChainId();

	const logos = {
		[polygon.id]: <NetworkPolygonPos />,
		[polygonAmoy.id]: <NetworkPolygonPos />,
	};

	return {
		selectedChain: chains.find((chain) => chain.id === chainId) ?? polygon,
		logo: logos[chainId],
	};
}
