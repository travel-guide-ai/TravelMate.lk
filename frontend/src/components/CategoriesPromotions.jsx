import React from "react";
import { Umbrella, Mountain, Home, Heart, Sun } from "lucide-react";

const categories = [
	{
		name: "Beach",
		icon: <Umbrella className="w-8 h-8 mx-auto text-blue-600 mb-3" />,
		bg: "bg-blue-100 hover:bg-blue-200",
	},
	{
		name: "Adventure",
		icon: <Mountain className="w-8 h-8 mx-auto text-green-600 mb-3" />,
		bg: "bg-green-100 hover:bg-green-200",
	},
	{
		name: "Cultural",
		icon: <Home className="w-8 h-8 mx-auto text-yellow-600 mb-3" />,
		bg: "bg-yellow-100 hover:bg-yellow-200",
	},
	{
		name: "Romantic",
		icon: <Heart className="w-8 h-8 mx-auto text-purple-600 mb-3" />,
		bg: "bg-purple-100 hover:bg-purple-200",
	},
];

function CategoriesPromotions() {
	return (
		<>
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">Travel By Category</h2>
				<p className="text-gray-600 max-w-2xl mx-auto">Find experiences tailored to your travel style</p>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
				{categories.map((cat, i) => (
					<div
						key={cat.name}
						className={`${cat.bg} rounded-xl p-6 text-center transition`}
					>
						{cat.icon}
						<h3 className="font-semibold">{cat.name}</h3>
					</div>
				))}
			</div>
			{/* Promo Banner */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
				<div className="relative z-10 max-w-xl">
					<h3 className="text-2xl md:text-3xl font-bold mb-4">Summer Sale - Up to 40% Off!</h3>
					<p className="mb-6 text-blue-100">Book your summer vacation now and save big on selected destinations.</p>
					<button className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition">
						Explore Deals
					</button>
				</div>
				<div className="absolute right-0 bottom-0 opacity-20">
					<Sun className="w-48 h-48 text-white" />
				</div>
			</div>
		</>
	);
}

export default CategoriesPromotions;
