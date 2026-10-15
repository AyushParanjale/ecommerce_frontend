import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CreateProductRequest } from '../../types/product';

interface FormValues {
	name: string;
	description: string;
	price: string;
	category: string;
	stockQuantity: string;
	imageUrl: string;
}

type FormFieldKey = keyof FormValues;

interface ProductFormProps {
	initialValues?: Partial<FormValues>;
	onSubmit: (data: CreateProductRequest) => Promise<void>;
	isSubmitting: boolean;
	submitLabel: string;
	serverError?: string;
	serverFieldErrors?: Record<string, string[]>;
}

const DEFAULT_VALUES: FormValues = {
	name: '',
	description: '',
	price: '',
	category: '',
	stockQuantity: '',
	imageUrl: '',
};

// Map .NET PascalCase field names to form field keys
const SERVER_FIELD_MAP: Record<string, FormFieldKey> = {
	Name: 'name',
	Description: 'description',
	Price: 'price',
	Category: 'category',
	StockQuantity: 'stockQuantity',
	ImageUrl: 'imageUrl',
};

function getServerFieldError(
	field: FormFieldKey,
	serverFieldErrors?: Record<string, string[]>,
): string | undefined {
	if (!serverFieldErrors) return undefined;
	const serverKey = Object.entries(SERVER_FIELD_MAP).find(([, v]) => v === field)?.[0];
	if (serverKey && serverFieldErrors[serverKey]?.length) {
		return serverFieldErrors[serverKey][0];
	}
	return undefined;
}

function validate(values: FormValues): Partial<Record<FormFieldKey, string>> {
	const errors: Partial<Record<FormFieldKey, string>> = {};

	const name = values.name.trim();
	if (!name) {
		errors.name = 'Name is required.';
	} else if (name.length > 200) {
		errors.name = 'Name must be at most 200 characters.';
	}

	const description = values.description.trim();
	if (!description) {
		errors.description = 'Description is required.';
	} else if (description.length > 2000) {
		errors.description = 'Description must be at most 2000 characters.';
	}

	if (!values.price.trim()) {
		errors.price = 'Price is required.';
	} else {
		const priceNum = parseFloat(values.price);
		if (isNaN(priceNum) || priceNum <= 0) {
			errors.price = 'Price must be greater than 0.';
		}
	}

	const category = values.category.trim();
	if (!category) {
		errors.category = 'Category is required.';
	} else if (category.length > 100) {
		errors.category = 'Category must be at most 100 characters.';
	}

	if (values.stockQuantity.trim() === '') {
		errors.stockQuantity = 'Stock quantity is required.';
	} else {
		const stockNum = Number(values.stockQuantity);
		if (!Number.isInteger(stockNum) || stockNum < 0) {
			errors.stockQuantity = 'Stock quantity must be a non-negative integer.';
		}
	}

	const imageUrl = values.imageUrl.trim();
	if (imageUrl) {
		if (imageUrl.length > 500) {
			errors.imageUrl = 'Image URL must be at most 500 characters.';
		} else {
			try {
				const url = new URL(imageUrl);
				if (url.protocol !== 'http:' && url.protocol !== 'https:') {
					errors.imageUrl = 'Image URL must be a valid HTTP or HTTPS URL.';
				}
			} catch {
				errors.imageUrl = 'Image URL must be a valid absolute URL.';
			}
		}
	}

	return errors;
}

export default function ProductForm({
	initialValues,
	onSubmit,
	isSubmitting,
	submitLabel,
	serverError,
	serverFieldErrors,
}: ProductFormProps) {
	const [values, setValues] = useState<FormValues>({
		...DEFAULT_VALUES,
		...initialValues,
	});
	const [localErrors, setLocalErrors] = useState<Partial<Record<FormFieldKey, string>>>({});
	const [submitted, setSubmitted] = useState(false);

	function handleChange(field: FormFieldKey, value: string) {
		const updated = { ...values, [field]: value };
		setValues(updated);
		if (submitted) {
			setLocalErrors(validate(updated));
		}
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitted(true);
		const errors = validate(values);
		setLocalErrors(errors);
		if (Object.keys(errors).length > 0) return;

		await onSubmit({
			name: values.name.trim(),
			description: values.description.trim(),
			price: parseFloat(values.price),
			category: values.category.trim(),
			stockQuantity: parseInt(values.stockQuantity, 10),
			imageUrl: values.imageUrl.trim() || undefined,
		});
	}

	function fieldError(field: FormFieldKey): string | undefined {
		return localErrors[field] ?? getServerFieldError(field, serverFieldErrors);
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			{serverError && (
				<div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{serverError}
				</div>
			)}

			<div className="space-y-5">
				<div>
					<label htmlFor="product-name" className="mb-1 block text-sm font-medium text-slate-700">
						Name <span aria-hidden="true">*</span>
					</label>
					<input
						id="product-name"
						type="text"
						value={values.name}
						onChange={(e) => handleChange('name', e.target.value)}
						aria-required="true"
						aria-invalid={fieldError('name') !== undefined}
						aria-describedby={fieldError('name') ? 'name-error' : undefined}
						className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('name') ? 'border-red-400' : 'border-slate-300'}`}
					/>
					{fieldError('name') && (
						<p id="name-error" className="mt-1 text-xs text-red-600">
							{fieldError('name')}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="product-description" className="mb-1 block text-sm font-medium text-slate-700">
						Description <span aria-hidden="true">*</span>
					</label>
					<textarea
						id="product-description"
						rows={4}
						value={values.description}
						onChange={(e) => handleChange('description', e.target.value)}
						aria-required="true"
						aria-invalid={fieldError('description') !== undefined}
						aria-describedby={fieldError('description') ? 'description-error' : undefined}
						className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('description') ? 'border-red-400' : 'border-slate-300'}`}
					/>
					{fieldError('description') && (
						<p id="description-error" className="mt-1 text-xs text-red-600">
							{fieldError('description')}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label htmlFor="product-price" className="mb-1 block text-sm font-medium text-slate-700">
							Price ($) <span aria-hidden="true">*</span>
						</label>
						<input
							id="product-price"
							type="number"
							step="0.01"
							min="0.01"
							value={values.price}
							onChange={(e) => handleChange('price', e.target.value)}
							aria-required="true"
							aria-invalid={fieldError('price') !== undefined}
							aria-describedby={fieldError('price') ? 'price-error' : undefined}
							className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('price') ? 'border-red-400' : 'border-slate-300'}`}
						/>
						{fieldError('price') && (
							<p id="price-error" className="mt-1 text-xs text-red-600">
								{fieldError('price')}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="product-stock" className="mb-1 block text-sm font-medium text-slate-700">
							Stock Quantity <span aria-hidden="true">*</span>
						</label>
						<input
							id="product-stock"
							type="number"
							step="1"
							min="0"
							value={values.stockQuantity}
							onChange={(e) => handleChange('stockQuantity', e.target.value)}
							aria-required="true"
							aria-invalid={fieldError('stockQuantity') !== undefined}
							aria-describedby={fieldError('stockQuantity') ? 'stock-error' : undefined}
							className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('stockQuantity') ? 'border-red-400' : 'border-slate-300'}`}
						/>
						{fieldError('stockQuantity') && (
							<p id="stock-error" className="mt-1 text-xs text-red-600">
								{fieldError('stockQuantity')}
							</p>
						)}
					</div>
				</div>

				<div>
					<label htmlFor="product-category" className="mb-1 block text-sm font-medium text-slate-700">
						Category <span aria-hidden="true">*</span>
					</label>
					<input
						id="product-category"
						type="text"
						value={values.category}
						onChange={(e) => handleChange('category', e.target.value)}
						aria-required="true"
						aria-invalid={fieldError('category') !== undefined}
						aria-describedby={fieldError('category') ? 'category-error' : undefined}
						className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('category') ? 'border-red-400' : 'border-slate-300'}`}
					/>
					{fieldError('category') && (
						<p id="category-error" className="mt-1 text-xs text-red-600">
							{fieldError('category')}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="product-image-url" className="mb-1 block text-sm font-medium text-slate-700">
						Image URL
					</label>
					<input
						id="product-image-url"
						type="url"
						value={values.imageUrl}
						onChange={(e) => handleChange('imageUrl', e.target.value)}
						aria-invalid={fieldError('imageUrl') !== undefined}
						aria-describedby={fieldError('imageUrl') ? 'image-url-error' : undefined}
						placeholder="https://example.com/image.jpg"
						className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-blue-500 ${fieldError('imageUrl') ? 'border-red-400' : 'border-slate-300'}`}
					/>
					{fieldError('imageUrl') && (
						<p id="image-url-error" className="mt-1 text-xs text-red-600">
							{fieldError('imageUrl')}
						</p>
					)}
				</div>
			</div>

			<div className="mt-6 flex items-center gap-4">
				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Saving…' : submitLabel}
				</button>
				<Link
					to="/admin/products"
					className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
				>
					Cancel
				</Link>
			</div>
		</form>
	);
}
