const raw = import.meta.env.VITE_API_BASE_URL;

if (typeof raw !== 'string' || !raw) {
	throw new Error(
		'VITE_API_BASE_URL is not set. Add it to your .env file:\nVITE_API_BASE_URL=http://localhost:5000',
	);
}

const API_BASE_URL = raw;

export function createApiUrl(path: string): string {
	return `${API_BASE_URL}${path}`;
}

export interface ProblemDetails {
	title?: string;
	detail?: string;
	status?: number;
	errors?: Record<string, string[]>;
}

export async function extractProblemDetails(response: Response): Promise<ProblemDetails> {
	try {
		const data: unknown = await response.json();
		return data as ProblemDetails;
	} catch {
		return { title: `Request failed with status ${response.status}`, status: response.status };
	}
}

export async function extractErrorMessage(response: Response): Promise<string> {
	try {
		const data: unknown = await response.json();
		const problem = data as ProblemDetails;
		if (problem.errors) {
			const messages = Object.values(problem.errors).flat();
			if (messages.length > 0) return messages.join(' ');
		}
		if (problem.detail) return problem.detail;
		if (problem.title) return problem.title;
	} catch {
		// response body is not JSON
	}
	return `Request failed with status ${response.status}`;
}
