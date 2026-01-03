import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
	Persona,
	PersonaListResponse,
	CreatePersonaRequest,
	UpdatePersonaRequest,
} from "../types";

/**
 * Hook to fetch all user personas
 */
export function usePersonas() {
	return useQuery({
		queryKey: ["personas"],
		queryFn: async () => {
			const response = await api.get<PersonaListResponse>(
				API_ENDPOINTS.PERSONAS
			);
			return response.data;
		},
	});
}

/**
 * Hook to fetch a single persona
 */
export function usePersona(id: string | null) {
	return useQuery({
		queryKey: ["persona", id],
		queryFn: async () => {
			if (!id) return null;
			const response = await api.get<Persona>(API_ENDPOINTS.PERSONA(id));
			return response.data;
		},
		enabled: !!id,
	});
}

/**
 * Hook to create a new persona
 */
export function useCreatePersona() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreatePersonaRequest) => {
			const response = await api.post<Persona>(API_ENDPOINTS.PERSONAS, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["personas"] });
		},
	});
}

/**
 * Hook to update a persona
 */
export function useUpdatePersona() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdatePersonaRequest;
		}) => {
			const response = await api.put<Persona>(API_ENDPOINTS.PERSONA(id), data);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["personas"] });
			queryClient.invalidateQueries({ queryKey: ["persona", variables.id] });
		},
	});
}

/**
 * Hook to delete a persona
 */
export function useDeletePersona() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(API_ENDPOINTS.PERSONA(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["personas"] });
		},
	});
}
