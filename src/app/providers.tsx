"use client";

import { ThemeProvider } from "@/components/themes-provider";
import { getConfig } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

export function Providers(props: {
	children: ReactNode;
	initialState?: State;
}) {
	const [config] = useState(() => getConfig());
	const [queryClient] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={config} initialState={props.initialState}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{props.children}
				</ThemeProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
