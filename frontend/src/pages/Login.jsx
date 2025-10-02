

import Header from '../components/Header';
import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';


const Login = () => {
	const { isSignedIn, user, isLoaded } = useUser();

	// Redirect if already signed in
	if (isLoaded && isSignedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	// Show loading if Clerk is still loading
	if (!isLoaded) {
		return (
			<div className="min-h-screen w-full flex flex-col">
				<Header />
				<div className="flex flex-1 h-full w-full justify-center items-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full flex flex-col">
			<Header />
			<div className="flex flex-1 h-full w-full">
				{/* Left side full image */}
				<div className="hidden md:block w-1/2 h-full relative">
					<img src={import.meta.env.BASE_URL + 'src/assets/images/login.jpg'} alt="Login Visual" className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
						<div className="text-white text-center p-8">
							<h3 className="text-4xl font-bold mb-4">Welcome Back!</h3>
							<p className="text-xl">Continue your Sri Lankan adventure</p>
						</div>
					</div>
				</div>
				{/* Right side full content */}
				<div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/90 px-8 py-12">
					<div className="w-full max-w-md">
						<h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Sign in to TravelMate.lk</h2>
						<p className="text-gray-500 mb-8 text-center">Welcome back! Plan your next Sri Lankan adventure.</p>
						<SignIn
							appearance={{
								elements: {
									card: "shadow-none bg-transparent border-none w-full",
									formButtonPrimary: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 w-full",
									headerTitle: "text-xl font-bold text-gray-800",
									headerSubtitle: "text-gray-500",
									formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
									formFieldLabel: "text-sm font-medium text-gray-700",
									identityPreviewEditButton: "text-blue-600 hover:text-blue-800",
									footerActionLink: "text-blue-600 hover:text-blue-800 font-medium",
									dividerLine: "bg-gray-300",
									dividerText: "text-gray-500",
									socialButtonsBlockButton: "w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200",
									socialButtonsBlockButtonText: "font-medium text-gray-700",
									formResendCodeLink: "text-blue-600 hover:text-blue-800 font-medium",
									alertText: "text-red-600 text-sm",
									formFieldErrorText: "text-red-600 text-sm mt-1",
								},
								layout: {
									socialButtonsPlacement: "top",
									socialButtonsVariant: "blockButton",
								}
							}}
							routing="path"
							path="/login"
							signUpUrl="/register"
							forceRedirectUrl="/"
							fallbackRedirectUrl="/"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
