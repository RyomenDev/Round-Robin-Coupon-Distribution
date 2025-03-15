import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const RegisterButton = ({ className }) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <button
      onClick={handleRegisterClick}
      className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ${
        className || ""
      }`}
    >
      Register
    </button>
  );
};

RegisterButton.propTypes = {
  className: PropTypes.string,
};

RegisterButton.defaultProps = {
  className: "",
};

export default RegisterButton;
