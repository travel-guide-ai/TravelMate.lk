

import Header from '../components/Header';
import { SignUp } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';


const Register = () => {
	const { isSignedIn, user, isLoaded } = useUser();

	// Redirect if already signed in
	if (isLoaded && isSignedIn) {
		return <Navigate to="/" replace />;
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
					<img src={import.meta.env.BASE_URL + 'src/assets/images/register.jpg'} alt="Register Visual" className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
						<div className="text-white text-center p-8">
							<h3 className="text-4xl font-bold mb-4">Join TravelMate.lk</h3>
							<p className="text-xl">Start planning your perfect Sri Lankan journey</p>
							<div className="mt-6 text-sm space-y-2">
								<p>✓ Personalized travel recommendations</p>
								<p>✓ Save and share itineraries</p>
								<p>✓ Connect with fellow travelers</p>
								<p>✓ Exclusive deals and offers</p>
							</div>
						</div>
					</div>
				</div>
				{/* Right side full content */}
				<div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/90 px-8 py-12">
					<div className="w-full max-w-md">
						<h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Create your account</h2>
						<p className="text-gray-500 mb-6 text-center">Join us and start planning your perfect Sri Lankan journey.</p>
						
						{/* Password Policy Information */}
						<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
							<ul className="text-xs text-blue-700 space-y-1">
								<li>• At least 8 characters long</li>
								<li>• Include uppercase and lowercase letters</li>
								<li>• Include at least one number</li>
								<li>• Include at least one special character</li>
							</ul>
						</div>

						<SignUp
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
									formFieldSuccessText: "text-green-600 text-sm mt-1",
									verificationLinkStatusBox: "border border-gray-300 rounded-lg p-4",
								},
								layout: {
									socialButtonsPlacement: "top",
									socialButtonsVariant: "blockButton",
								}
							}}
							routing="path"
							path="/register"
							signInUrl="/login"
							forceRedirectUrl="/"
							fallbackRedirectUrl="/"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
