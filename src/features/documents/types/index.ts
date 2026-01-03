/**
 * Document Types - matching backend schemas
 */

export interface Document {
	id: number;
	filename: string;
	file_type: string;
	file_size: number;
	status: string;
	created_at: string;
}

export interface DocumentListResponse {
	documents: Document[];
	total: number;
}

export interface DocumentUploadResponse {
	id: number;
	filename: string;
	file_type: string;
	file_size: number;
	status: string;
	created_at: string;
}
