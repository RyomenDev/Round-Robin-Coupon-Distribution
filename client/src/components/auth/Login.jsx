import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice";
import { RiUser3Line, RiLock2Line } from "react-icons/ri";
import bgImage from "../../assets/auth-bg.png";
import { loginUser } from "../../api";
import { useNavigate } from "react-router-dom";
import { InputField, PasswordField } from "../../utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log({email, password});
    setMessage(""); // Reset message
    // console.log({ email, password });

    try {
      const data = await loginUser(email, password);
      const { token, user } = data;
      //   console.log({ token, user });

      localStorage.setItem("token", token);
      //   console.log({data});
      dispatch(authLogin(user));
      setMessage("✅ Login successful");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage(`❌ ${error}`);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background image */}
      <img
        src={bgImage}
        alt="login background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Semi-Transparent Wooden Overlay for Depth */}
      {/* <div className="absolute inset-0 bg-[#3B2F2F]/10 backdrop-blur-md"></div> */}

      <div className="relative bg-white/10 border-2 border-white mx-6 p-8 rounded-xl backdrop-blur-md sm:w-[400px] sm:p-12">
        <h1 className="text-center text-2xl font-medium text-gray-900 mb-8">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-6 mb-6">
            {/* Email input */}
            <InputField
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              Icon={<RiUser3Line />}
              required={true}
            />

            {/* Password input */}
            <PasswordField
              name="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              showChecklist={false}
              Icon={<RiLock2Line />}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="login-check" className="w-4 h-4" />
              <label htmlFor="login-check" className="text-sm text-slate-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-slate-700 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200"
          >
            Login
          </button>
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </form>
        <p className="text-center text-sm text-gray-700 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
