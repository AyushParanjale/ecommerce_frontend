import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// UX-only guard — backend authorization is the real security boundary.
export default function AdminRoute() {

	const { user } = useAuth();

	if (user?.role !== 'Admin') {
		return (
			<main className="mx-auto max-w-7xl px-6 py-16 text-center">
				<p className="text-lg text-slate-700">You do not have access to this page.</p>
				<Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
					Go to home
				</Link>
			</main>
		);
	}

	return <Outlet />;
}
