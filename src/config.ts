import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const chains = [polygon, polygonAmoy];

export function getConfig() {
	return createConfig({
		chains: [polygon, polygonAmoy],
		connectors: [injected()],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		transports: {
			[polygon.id]: http(),
			[polygonAmoy.id]: http(),
		},
	});
}

declare module "wagmi" {
	interface Register {
		config: ReturnType<typeof getConfig>;
	}
}
