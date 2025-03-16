import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import PropTypes from "prop-types";

function LogoutBtn({ className = "" }) {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <button
      onClick={logoutHandler}
      className={`${
        className ||
        "flex items-center justify-center px-4 py-2 text-lg font-medium rounded-lg bg-red-400 hover:bg-red-600 hover:text-white transition duration-300"
      }`}
    >
      Logout
    </button>
  );
}

LogoutBtn.propTypes = {
  className: PropTypes.string,
};

export default LogoutBtn;
