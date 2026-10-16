import { Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderResultPage from './pages/OrderResultPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';

export default function App() {
	return (
		<Routes>
			<Route element={<RootLayout />}>
				<Route index element={<HomePage />} />
				<Route path="/products/:productId" element={<ProductDetailsPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route element={<ProtectedRoute />}>
					<Route path="cart" element={<CartPage />} />
					<Route path="checkout" element={<CheckoutPage />} />
					<Route path="orders">
						<Route index element={<OrderHistoryPage />} />
						<Route path=":orderId" element={<OrderDetailsPage />} />
						<Route path=":orderId/payment" element={<PaymentPage />} />
						<Route path=":orderId/result" element={<OrderResultPage />} />
					</Route>
					<Route path="admin" element={<AdminRoute />}>
						<Route index element={<AdminDashboardPage />} />
						<Route path="products">
							<Route index element={<AdminProductListPage />} />
							<Route path="new" element={<AdminProductCreatePage />} />
							<Route path=":productId/edit" element={<AdminProductEditPage />} />
						</Route>
						<Route path="orders">
							<Route index element={<AdminOrderListPage />} />
							<Route path=":orderId" element={<AdminOrderDetailsPage />} />
						</Route>
					</Route>
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}
