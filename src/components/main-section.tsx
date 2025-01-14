import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Chain } from "wagmi/chains";

export const MainSection = ({
	accountAbstraction,
	chain,
	isLoading,
}: {
	accountAbstraction?: string;
	chain?: Chain;
	isLoading: boolean;
}) => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Transfer to your own Smart Wallet</h1>
			<div className="flex gap-1 text-sm text-gray-500">
				<h2>Your funds will be sent to your own Smart Wallet</h2>
				<Link
					className="font-bold underline"
					title={accountAbstraction}
					href={`${chain?.blockExplorers?.default?.url}/address/${accountAbstraction}`}
					target="_blank"
				>
					{isLoading || !accountAbstraction ? (
						<Skeleton className="inline-flex w-24 h-4" />
					) : (
						<p className="underline inline-flex text-sm">
							{accountAbstraction.slice(0, 6)}...
							{accountAbstraction.slice(-4)}
						</p>
					)}
				</Link>
			</div>
		</div>
	);
};
