import { Routes, Route } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderResultPage from './pages/OrderResultPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

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
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}
