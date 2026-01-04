import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
	listPersonasService,
	createPersonaService,
	deletePersonaService,
} from "@/services/personaService";
import { CreatePersonaRequest } from "../types";

/**
 * Hook to fetch all user personas
 */
export function usePersonas() {
	return useQuery({
		queryKey: ["personas"],
		queryFn: async () => {
			const res = await listPersonasService();
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
	});
}

/**
 * Hook to fetch a single persona by ID
 */
export function usePersona(id: string) {
	return useQuery({
		queryKey: ["persona", id],
		queryFn: async () => {
			const response = await api.get(`/personas/${id}`);
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
			const res = await createPersonaService(data);
			if (!res.success) throw new Error(res.error);
			return res.data;
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
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const response = await api.put(`/personas/${id}`, data);
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
			const res = await deletePersonaService(id);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["personas"] });
		},
	});
}
