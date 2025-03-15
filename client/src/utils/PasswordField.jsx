import { useState } from "react";
import PropTypes from "prop-types";
import ErrorDisplay from "./ErrorDisplay.jsx";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri";

const PasswordField = ({ name, placeholder, value, onChange, error, Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const handleChange = (e) => {
    onChange(e);
    setIsTypingPassword(e.target.value.length > 0);
  };

  const handleBlur = () => {
    setIsTypingPassword(false);
  };

  return (
    <div className="mb-2">
      <div className="flex items-center border-b-2 border-white pb-2 relative">
        {Icon && <span className="text-gray-900 text-xl">{Icon}</span>}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-transparent text-gray-900 px-2 py-2 placeholder-slate-700 focus:outline-none transition ${
              error && !isTypingPassword ? "border-red-500" : "border-gray-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
          </button>
        </div>
      </div>

      {error && !isTypingPassword && <ErrorDisplay error={error} />}
    </div>
  );
};

PasswordField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  Icon: PropTypes.node,
};

export default PasswordField;
