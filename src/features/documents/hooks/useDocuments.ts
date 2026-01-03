import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import {
	Document,
	DocumentListResponse,
	DocumentUploadResponse,
} from "../types";

/**
 * Hook to fetch user's documents
 */
export function useDocuments(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["documents", limit, offset],
		queryFn: async () => {
			const response = await api.get<DocumentListResponse>(
				API_ENDPOINTS.DOCUMENTS,
				{
					params: { limit, offset },
				}
			);
			return response.data;
		},
	});
}

/**
 * Hook to fetch a single document
 */
export function useDocument(id: number | null) {
	return useQuery({
		queryKey: ["document", id],
		queryFn: async () => {
			if (!id) return null;
			const response = await api.get<Document>(API_ENDPOINTS.DOCUMENT(id));
			return response.data;
		},
		enabled: !!id,
	});
}

/**
 * Hook to upload a document
 */
export function useUploadDocument() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await api.post<DocumentUploadResponse>(
				API_ENDPOINTS.DOCUMENT_UPLOAD,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data;
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
			await api.delete(API_ENDPOINTS.DOCUMENT(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
	});
}
