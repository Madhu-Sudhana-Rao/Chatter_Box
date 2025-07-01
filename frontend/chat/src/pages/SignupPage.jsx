import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/image.jpeg";
import isSignup from "../hooks/isSignup";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { signupMutation, isPending, error } = isSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-3" data-theme="dracula">
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-base-100 rounded-2xl shadow-xl overflow-hidden">

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-full shadow">
              <MessageCircle className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Chatter Box
            </span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">
            {isPending ? "Signing Up..." : "Create Account"}
          </h2>
          <p className="text-xs text-base-content/70 mb-4">
            Join real-time conversations.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-2 py-1 rounded-md mb-3 text-xs">
              {error.response?.data?.message || error.message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              value={signupData.fullName}
              onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />

            <div className="flex items-start text-xs gap-2">
              <input type="checkbox" className="checkbox checkbox-primary" required />
              <span>Agree to Terms & Privacy</span>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-3 text-center text-xs">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 relative h-56 md:h-auto">
            <img src={image} alt="Chat" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 rounded-r-2xl md:rounded-none" />
          </div>
          <div className="p-3 bg-base-100 text-center">
            <h2 className="text-sm font-semibold text-white">Talk. Connect. Grow.</h2>
            <p className="text-[10px] opacity-70 text-base-content mt-1">
              Make new friends and chat across cultures.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
