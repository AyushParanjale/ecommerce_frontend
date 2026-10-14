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
