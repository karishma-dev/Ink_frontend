/**
 * Draft Service
 * Handles all draft-related API calls
 */

import api from "@/lib/api";
import { tryCatchWrapperForService } from "@/lib/tryCatchWrapper";

export interface Draft {
	id: number;
	title: string;
	content: string;
	status: "draft" | "published" | "archived";
	created_at: string;
	updated_at: string;
}

export interface DraftUpdate {
	title?: string;
	content?: string;
	status?: "draft" | "published" | "archived";
}

export const getDraftsService = (limit = 20, offset = 0) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get(`/drafts/`, {
			params: { limit, offset },
		});
		return response.data;
	});
};

export const getDraftService = (draftId: number) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get(`/drafts/${draftId}`);
		return response.data;
	});
};

export const createDraftService = (data: {
	title: string;
	content?: string;
}) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.post(`/drafts/`, data);
		return response.data;
	});
};

export const updateDraftService = (draftId: number, data: DraftUpdate) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.put(`/drafts/${draftId}`, data);
		return response.data;
	});
};

export const deleteDraftService = (draftId: number) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.delete(`/drafts/${draftId}`);
		return response.data;
	});
};
