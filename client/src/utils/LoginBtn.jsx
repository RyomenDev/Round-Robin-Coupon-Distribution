import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const LoginButton = ({ className="" }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <button
      onClick={handleLoginClick}
      className={`${
        className ||
        "px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      }`}
    >
      Login
    </button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
};

export default LoginButton;
