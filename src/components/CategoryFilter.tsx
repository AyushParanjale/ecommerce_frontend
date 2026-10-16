interface CategoryFilterProps {
	categories: string[];
	selected: string;
	onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {

	return (
		<div className="mb-8 flex flex-wrap gap-2">
			{categories.map((category) => (
				<button
					key={category}
					type="button"
					onClick={() => onSelect(category)}
					aria-pressed={selected === category}
					className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
						selected === category
							? 'bg-blue-600 text-white'
							: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
					}`}
				>
					{category}
				</button>
			))}
		</div>
	);
}
