import { useState } from "react";
import { registerUser } from "../../api";
import { RiUser3Line, RiLock2Line } from "react-icons/ri";
import bgImage from "../../assets/auth-bg.png";
import { useNavigate } from "react-router-dom";
import { InputField, PasswordField } from "../../utils";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // console.log({ name,email, password });
    setMessage("");
    if (!validateForm()) {
      return;
    }
    // console.log({ name, email, password });

    try {
      await registerUser(name, email, password);
      setMessage("✅ Registration successful");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(`❌ ${error}`);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background image */}
      <img
        src={bgImage}
        alt="login background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative bg-white/10 border-2 border-white mx-6 p-8 rounded-xl backdrop-blur-md sm:w-[400px] sm:p-12">
        <h1 className="text-center text-3xl font-medium text-gray-900 mb-8">
          Register
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-6 mb-6">
            {/* Name input */}
            <InputField
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
              }}
              required={true}
              error={errors.name}
              Icon={<RiUser3Line />}
            />

            {/* Email input */}
            <InputField
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
              }}
              error={errors.email}
              Icon={<RiUser3Line />}
              required={true}
            />

            {/* Password input */}

            <PasswordField
              name="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
              }}
              error={errors.password}
              showChecklist={true}
              required={true}
              Icon={<RiLock2Line />}
            />
            {/* Confirm-Password input */}
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: "",
                }));
              }}
              error={errors.confirmPassword}
              showChecklist={false}
              Icon={<RiLock2Line />}
            />
          </div>

          <a
            href="#"
            className="text-sm text-slate-700 hover:underline flex justify-end"
          >
            Forgot Password?
          </a>
          <div className="flex items-center gap-2">
            {/* Consent checkbox */}

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className=""
              />

              <span className="">
                By continuing, you agree to Quizo's{" "}
                <a href="#" className="text-blue-500">
                  Terms of Service
                </a>{" "}
                &{" "}
                <a href="#" className="text-blue-500">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-medium rounded-lg ${
              isChecked
                ? "bg-white text-gray-900 hover:bg-gray-200"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            disabled={!isChecked}
          >
            Resister
          </button>
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </form>
        <p className="text-center text-sm text-gray-700 mt-6">
          Have an account?{" "}
          <a href="/login" className="font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
