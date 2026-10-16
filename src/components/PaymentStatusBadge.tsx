import type { PaymentStatus } from '../types/payment';

const labels: Record<PaymentStatus, string> = {
	Pending: 'Pending',
	Succeeded: 'Succeeded',
	Failed: 'Failed',
};

const colors: Record<PaymentStatus, string> = {
	Pending: 'bg-amber-100 text-amber-800',
	Succeeded: 'bg-green-100 text-green-800',
	Failed: 'bg-red-100 text-red-800',
};

interface Props {
	status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: Props) {
	return (
		<span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
			{labels[status]}
		</span>
	);
}
