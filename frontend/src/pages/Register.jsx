
import { SignUp } from "@clerk/clerk-react";

const Register = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200">
			<div className="w-full max-w-md p-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center">
				   <img src={import.meta.env.BASE_URL + 'src/assets/images/logo1.png'} alt="TravelMate.lk Logo" className="w-24 mb-6 drop-shadow-lg" />
				<h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Create your TravelMate.lk account</h2>
				<p className="text-gray-500 mb-6 text-center">Join us and start planning your perfect Sri Lankan journey.</p>
				   <SignUp
					   appearance={{
						   elements: {
							   card: "shadow-none bg-transparent border-none",
							   formButtonPrimary: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 rounded-full transition-all duration-200",
							   headerTitle: "text-xl font-bold text-gray-800",
							   headerSubtitle: "text-gray-500",
						   },
					   }}
					   routing="path"
					   path="/register"
				   />
			</div>
		</div>
	);
};

export default Register;
