

import Header from '../components/Header';
import { SignUp } from "@clerk/clerk-react";


const Register = () => {
	return (
		<div className="min-h-screen w-full flex flex-col">
			<Header />
			<div className="flex flex-1 h-full w-full">
				{/* Left side full image */}
				<div className="hidden md:block w-1/2 h-full">
					<img src={import.meta.env.BASE_URL + 'src/assets/images/register.jpg'} alt="Register Visual" className="w-full h-full object-cover" />
				</div>
				{/* Right side full content */}
				<div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white/90 px-8 py-12">
					<img src={import.meta.env.BASE_URL + 'src/assets/images/logo1.png'} alt="TravelMate.lk Logo" className="w-24 mb-6 drop-shadow-lg" />
					<h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight text-center">Create your TravelMate.lk account</h2>
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
		</div>
	);
};

export default Register;
