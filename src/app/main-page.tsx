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
import { parseUnits } from "viem";
import { MainSection } from "@/components/main-section";

// Schema for validating form input - requires a valid Ethereum address and positive amount
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

	// Fetch the user's Account Abstraction wallet address
	const { data, isLoading } = useAccountAbstraction();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tokenAddress: "0x",
			amount: 0,
		},
	});

	// Handles the token transfer to the user's Account Abstraction wallet
	const { mutateAsync: submit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({
			tokenAddress,
			amount,
		}: z.infer<typeof formSchema>) => {
			const id = toast.loading("Awaiting for approval...");

			// First fetch token decimals to properly format the transfer amount
			const decimals = await readContract({
				abi: erc20Abi,
				address: tokenAddress,
				functionName: "decimals",
			}).catch((error) => {
				toast.error("Could not get token decimals", { id });
				throw error;
			});

			// Execute the ERC20 transfer to the AA wallet
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

						// Show success message with link to block explorer
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
				<MainSection
					accountAbstraction={data?.wallet.accountAbstraction}
					chain={chain}
					isLoading={isLoading}
				/>

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
