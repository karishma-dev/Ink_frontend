import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDraftsService,
	getDraftService,
	createDraftService,
	updateDraftService,
	deleteDraftService,
} from "@/services/draftService";

/**
 * Hook to fetch user's drafts
 */
export function useDrafts(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["drafts", limit, offset],
		queryFn: async () => {
			const res = await getDraftsService(limit, offset);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
	});
}

/**
 * Hook to fetch a single draft
 */
export function useDraft(id: number | null) {
	return useQuery({
		queryKey: ["draft", id],
		queryFn: async () => {
			if (!id) return null;
			const res = await getDraftService(id);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		enabled: !!id,
	});
}

/**
 * Hook to create a draft
 */
export function useCreateDraft() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { title: string; content?: string }) => {
			const res = await createDraftService(data);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drafts"] });
		},
	});
}

/**
 * Hook to update a draft
 */
export function useUpdateDraft() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: number; data: any }) => {
			const res = await updateDraftService(id, data);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["drafts"] });
			queryClient.invalidateQueries({ queryKey: ["draft", variables.id] });
		},
	});
}

/**
 * Hook to delete a draft
 */
export function useDeleteDraft() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const res = await deleteDraftService(id);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["drafts"] });
		},
	});
}
