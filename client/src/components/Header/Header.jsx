import { useState } from "react";
import HeaderData from "../../Data/HeaderData.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutBtn, LoginButton } from "../../utils";

const Header = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state?.auth?.status);
  const userData = useSelector((state) => state?.auth?.userData);
  const userName = userData?.name;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { topHeader } = HeaderData;
  const { logo, appName } = topHeader;

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative top-0 left-0 w-full z-50 flex items-center justify-between bg-gradient-to-b from-[#4E2A1E] via-[#5C4033] to-[#3B2F2F] text-white py-4 px-6 shadow-lg">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:shadow-lg rounded-lg transition-all duration-300"
        onClick={handleLogoClick}
      >
        <img
          src={logo}
          alt="HealthBridge"
          className="w-auto h-10 md:h-14 transition-transform duration-300 hover:scale-105"
        />
        <div className="text-xl font-semibold md:text-2xl hover:text-indigo-400 transition-all duration-300">
          {appName}
        </div>
      </div>

      {/* Authentication & Language Section */}
      <div
        className={` md:flex md:relative md:top-0 md:bg-transparent md:shadow-none md:p-0 md:space-x-6 md:flex-row`}
      >
        {/* Authentication Section */}
        <div className="text-center">
          {authStatus ? (
            <div className="flex flex-col items-center md:flex-row md:gap-4">
              <span className="text-lg font-semibold text-white">
                Hello, {userName}
              </span>
              <LogoutBtn />
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center md:flex-row md:gap-4">
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
