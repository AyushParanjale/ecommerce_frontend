import type { OrderStatus } from '../types/order';

const labels: Record<OrderStatus, string> = {
	PendingPayment: 'Pending Payment',
	Confirmed: 'Confirmed',
	PaymentFailed: 'Payment Failed',
	Cancelled: 'Cancelled',
};

const colors: Record<OrderStatus, string> = {
	PendingPayment: 'bg-amber-100 text-amber-800',
	Confirmed: 'bg-green-100 text-green-800',
	PaymentFailed: 'bg-red-100 text-red-800',
	Cancelled: 'bg-slate-100 text-slate-600',
};

interface Props {
	status: OrderStatus;
}

export default function OrderStatusBadge({ status }: Props) {
	return (
		<span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
			{labels[status]}
		</span>
	);
}
