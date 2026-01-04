/**
 * tryCatchWrapper for service functions
 * Wraps async functions with consistent error handling
 * Returns {success, data} or {error, success: false}
 */

export interface ServiceResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export const tryCatchWrapperForService = async <T>(
	service: () => Promise<T>
): Promise<ServiceResponse<T>> => {
	try {
		const response = await service();
		return {
			success: true,
			data: response,
		};
	} catch (error: unknown) {
		console.error("Service error:", error);

		if (error instanceof Error) {
			// Handle axios/fetch errors
			const axiosError = error as {
				response?: { data?: { error?: string; message?: string } };
			};

			if (axiosError.response?.data) {
				const errorMessage =
					typeof axiosError.response.data.error === "string"
						? axiosError.response.data.error
						: axiosError.response.data.message || error.message;

				return {
					success: false,
					error: errorMessage,
					message: axiosError.response.data.message,
				};
			}

			return {
				success: false,
				error: error.message || "An error occurred",
			};
		}

		return {
			success: false,
			error: "An unexpected error occurred",
		};
	}
};
