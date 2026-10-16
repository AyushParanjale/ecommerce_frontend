interface ErrorStateProps {
	message: string;
	onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {

	return (
		<div className="py-20 text-center">
			<p className="text-lg font-medium text-slate-900">Failed to load products</p>
			<p className="mt-2 text-sm text-slate-500">{message}</p>
			<button
				type="button"
				onClick={onRetry}
				className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
			>
				Retry
			</button>
		</div>
	);
}
