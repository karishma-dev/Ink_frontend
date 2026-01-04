"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth";
import { ToastProvider } from "@/components/ui";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60, // 1 minute
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

interface ProvidersProps {
	children: ReactNode;
}

import { Provider } from "react-redux";
import store from "@/store";

export function Providers({ children }: ProvidersProps) {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<ToastProvider>{children}</ToastProvider>
				</AuthProvider>
			</QueryClientProvider>
		</Provider>
	);
}
