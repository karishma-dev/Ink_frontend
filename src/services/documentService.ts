/**
 * Document Service
 * Handles document library and uploads
 */

import api from "@/lib/api";
import { tryCatchWrapperForService } from "@/lib/tryCatchWrapper";

export interface Document {
	id: number;
	filename: string;
	file_type: string;
	file_size: number;
	created_at: string;
	status: "pending" | "processed" | "error";
}

export const listDocumentsService = (limit = 20, offset = 0) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get(`/documents/`, {
			params: { limit, offset },
		});
		return response.data;
	});
};

export const uploadDocumentService = (file: File) => {
	return tryCatchWrapperForService(async () => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await api.post(`/documents/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	});
};

export const deleteDocumentService = (documentId: number) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.delete(`/documents/${documentId}`);
		return response.data;
	});
};
