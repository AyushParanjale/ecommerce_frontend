// import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
				<h1 className="text-5xl font-bold text-yellow-400">
					Reprua
				</h1>
			</main>

			<Footer />
		</div>
	);
}

export default App;
