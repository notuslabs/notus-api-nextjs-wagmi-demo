"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Check, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { polygon, polygonAmoy } from "wagmi/chains";
import { NetworkPolygonPos } from "@web3icons/react";
import { chains } from "@/config";
import { cn } from "@/lib/utils";
import { useChain } from "@/hooks/useChain";

export function Navbar() {
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { isConnected, address } = useAccount();
	const { switchChain } = useSwitchChain();
	const { selectedChain, logo } = useChain();

	return (
		<header className="flex gap-2 justify-end px-4 py-8">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>{logo}</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Switch Chain</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{chains.map((chain) => (
						<DropdownMenuItem
							key={chain.id}
							onClick={() => switchChain({ chainId: chain.id })}
						>
							<Check
								className={cn(
									"w-4 h-4",
									selectedChain.id === chain.id ? "opacity-100" : "opacity-0",
								)}
							/>
							{logo} {chain.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{isConnected ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>
							<Wallet /> {address?.slice(0, 7)}...{address?.slice(-5)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => disconnect()}>
							Disconnect
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button
					onClick={() =>
						connect({
							connector: connectors[1],
							chainId: polygon.id,
						})
					}
				>
					Connect Wallet
				</Button>
			)}
		</header>
	);
}
