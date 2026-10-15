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
					<Route path="orders/:orderId/payment" element={<PaymentPage />} />
					<Route path="orders/:orderId/result" element={<OrderResultPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}
