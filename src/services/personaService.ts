/**
 * Persona Service
 * Handles AI persona management
 */

import api from "@/lib/api";
import { tryCatchWrapperForService } from "@/lib/tryCatchWrapper";
import { Persona } from "@/features/personas/types";

export const listPersonasService = () => {
	return tryCatchWrapperForService(async () => {
		const response = await api.get(`/personas/`);
		return response.data;
	});
};

export const createPersonaService = (data: {
	name: string;
	description: string;
	voice_sample?: string;
}) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.post(`/personas/`, data);
		return response.data;
	});
};

export const deletePersonaService = (personaId: string) => {
	return tryCatchWrapperForService(async () => {
		const response = await api.delete(`/personas/${personaId}`);
		return response.data;
	});
};
