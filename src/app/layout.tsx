import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { cookieToInitialState } from "wagmi";

import { getConfig } from "@/config";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Notus Account Abstraction - Demo",
	description: "Demo of Notus Account Abstraction",
};

export default async function RootLayout(props: { children: ReactNode }) {
	const initialState = cookieToInitialState(
		getConfig(),
		(await headers()).get("cookie"),
	);
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<div className="w-full flex justify-center px-4">
					<div className="container">
						<Providers initialState={initialState}>
							<Navbar />
							{props.children}
						</Providers>
						<Toaster />
					</div>
				</div>
			</body>
		</html>
	);
}
