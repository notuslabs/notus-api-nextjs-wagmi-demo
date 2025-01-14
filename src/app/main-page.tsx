"use client";

import { Button } from "@/components/ui/button";
import { erc20Abi } from "@/abis/erc20";
import { useAccountAbstraction } from "@/hooks/useAccountAbstraction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Link from "next/link";
import { parseUnits } from "viem";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
	tokenAddress: z
		.string()
		.min(42, "Invalid token address")
		.transform((value) => value as `0x${string}`),
	amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
});

export function MainPage() {
	const { isConnected, chain } = useAccount();
	const { writeContract } = useWriteContract();
	const { readContract, waitForTransactionReceipt } = usePublicClient();

	const { data, isLoading } = useAccountAbstraction();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tokenAddress: "0x",
			amount: 0,
		},
	});

	const { mutateAsync: submit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({
			tokenAddress,
			amount,
		}: z.infer<typeof formSchema>) => {
			const id = toast.loading("Awaiting for approval...");
			const decimals = await readContract({
				abi: erc20Abi,
				address: tokenAddress,
				functionName: "decimals",
			}).catch((error) => {
				toast.error("Could not get token decimals", { id });
				throw error;
			});

			writeContract(
				{
					abi: erc20Abi,
					address: tokenAddress,
					functionName: "transfer",
					args: [
						data?.wallet.accountAbstraction as `0x${string}`,
						parseUnits(amount.toString(), decimals),
					],
				},
				{
					onSuccess: async (txHash) => {
						toast.loading("Waiting for confirmation...", { id });

						await waitForTransactionReceipt({
							hash: txHash,
						});

						toast.success("Transaction successful", {
							id,
							action: {
								label: "View on block explorer",
								onClick: () => {
									window.open(
										`${chain?.blockExplorers.default.url}/tx/${txHash}`,
										"_blank",
									);
								},
							},
						});
					},
					onError: (error) => {
						toast.error("Could not complete transaction", {
							id,
							description: error.message,
						});
					},
				},
			);
		},
	});

	return (
		<main className="container mx-auto p-8">
			<div className="max-w-md mx-auto space-y-4">
				<div>
					<h1 className="text-2xl font-bold">
						Transfer to your own Smart Wallet
					</h1>
					<div className="flex gap-1 text-sm text-gray-500">
						<h2>Your funds will be sent to your own Smart Wallet</h2>
						<Link
							className="font-bold underline"
							title={data?.wallet.accountAbstraction}
							href={`${chain?.blockExplorers.default.url}/address/${data?.wallet.accountAbstraction}`}
							target="_blank"
						>
							{isLoading ? (
								<Skeleton className="inline-flex w-24 h-4" />
							) : (
								<p className="underline inline-flex text-sm">
									{data?.wallet.accountAbstraction.slice(0, 6)}...
									{data?.wallet.accountAbstraction.slice(-4)}
								</p>
							)}
						</Link>
					</div>
				</div>

				{isConnected ? (
					<div className="space-y-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit((data) => submit(data))}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="tokenAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Token Address</FormLabel>
											<FormControl>
												<Input placeholder="0x..." {...field} />
											</FormControl>
											<FormDescription>
												Enter the token contract address you want to transfer
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Amount</FormLabel>
											<FormControl>
												<Input placeholder="0" {...field} />
											</FormControl>
											<FormDescription>
												Enter the amount of tokens you want to transfer
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={isSubmitting} type="submit">
									Submit
								</Button>
							</form>
						</Form>
					</div>
				) : (
					<div className="text-center">
						<p className="mb-4">Please connect your wallet first</p>
					</div>
				)}
			</div>
		</main>
	);
}
