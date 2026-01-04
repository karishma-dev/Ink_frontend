import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface ActivePersonaResponse {
	persona_id: string | null;
}

/**
 * Get the active persona for the current user
 */
export function useActivePersona() {
	return useQuery({
		queryKey: ["activePersona"],
		queryFn: async () => {
			const response = await api.get<ActivePersonaResponse>(
				"/users/active-persona"
			);
			return response.data.persona_id;
		},
	});
}

/**
 * Set a persona as active
 */
export function useSetActivePersona() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (personaId: string) => {
			const response = await api.put<ActivePersonaResponse>(
				"/users/active-persona",
				{
					persona_id: personaId,
				}
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["activePersona"] });
			queryClient.invalidateQueries({ queryKey: ["personas"] });
		},
	});
}

/**
 * Clear the active persona
 */
export function useClearActivePersona() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api.delete<ActivePersonaResponse>(
				"/users/active-persona"
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["activePersona"] });
			queryClient.invalidateQueries({ queryKey: ["personas"] });
		},
	});
}
