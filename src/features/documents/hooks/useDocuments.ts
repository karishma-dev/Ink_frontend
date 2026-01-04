import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	listDocumentsService,
	uploadDocumentService,
	deleteDocumentService,
} from "@/services/documentService";

/**
 * Hook to fetch user's documents
 */
export function useDocuments(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["documents", limit, offset],
		queryFn: async () => {
			const res = await listDocumentsService(limit, offset);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
	});
}

/**
 * Hook to upload a document
 */
export function useUploadDocument() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			const res = await uploadDocumentService(file);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
	});
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const res = await deleteDocumentService(id);
			if (!res.success) throw new Error(res.error);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
	});
}
