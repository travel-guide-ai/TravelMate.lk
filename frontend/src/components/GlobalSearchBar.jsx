import React from "react";
import { Search, Zap } from "lucide-react";

function GlobalSearchBar() {
	return (
		<div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 md:p-4 border border-gray-200 shadow-xl max-w-3xl mx-auto transition-all duration-300">
			<div className="flex items-center">
				<input
					type="text"
					placeholder="Where do you want to go? Try '2 week Europe trip' or 'beach resorts in Bali'..."
					className="flex-grow px-6 py-4 rounded-2xl focus:outline-none text-gray-700 bg-transparent placeholder-gray-400"
				/>
				<button className="bg-blue-600 text-white p-3 rounded-xl m-1 hover:bg-blue-700 transition shadow-md">
					<Search className="w-6 h-6" />
				</button>
			</div>
			<div className="px-4 py-2 text-sm text-gray-600 flex items-center">
				<Zap className="w-4 h-4 mr-2 text-yellow-500" />
				<span>AI Suggestions: Romantic Getaways | Family Vacations | Adventure Tours</span>
			</div>
		</div>
	);
}

export default GlobalSearchBar;
