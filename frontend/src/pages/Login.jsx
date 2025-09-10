

import Header from '../components/Header';
import { SignIn } from "@clerk/clerk-react";


const Login = () => {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200">
			<Header />
			<div className="flex-1 flex justify-center items-center">
				<div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl p-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0">
					<div className="hidden md:flex flex-col justify-center items-center w-1/2 pr-8 border-r border-blue-100">
						<img src={import.meta.env.BASE_URL + 'src/assets/images/logo1.png'} alt="TravelMate.lk Logo" className="w-32 mb-6 drop-shadow-lg" />
						<h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Sign in to TravelMate.lk</h2>
						<p className="text-gray-500 mb-6 text-center">Welcome back! Plan your next Sri Lankan adventure.</p>
					</div>
					<div className="w-full md:w-1/2 flex flex-col items-center justify-center">
						<div className="md:hidden flex flex-col items-center mb-6">
							<img src={import.meta.env.BASE_URL + 'src/assets/images/logo1.png'} alt="TravelMate.lk Logo" className="w-24 mb-4 drop-shadow-lg" />
							<h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Sign in to TravelMate.lk</h2>
							<p className="text-gray-500 mb-6 text-center">Welcome back! Plan your next Sri Lankan adventure.</p>
						</div>
						<SignIn
							appearance={{
								elements: {
									card: "shadow-none bg-transparent border-none",
									formButtonPrimary: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 rounded-full transition-all duration-200",
									headerTitle: "text-xl font-bold text-gray-800",
									headerSubtitle: "text-gray-500",
								},
							}}
							routing="path"
							path="/login"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
