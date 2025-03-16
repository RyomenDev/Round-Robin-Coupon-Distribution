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

  const { topHeader } = HeaderData;
  const { logo, appName } = topHeader;

  const handleLogoClick = () => {
    navigate("/");
  };

  const adminPanelClickHandler = () => {
    navigate("/admin");
  };

  return (
    <>
      <header className="z-50 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-b from-[#4E2A1E] via-[#5C4033] to-[#3B2F2F] text-white">
        {/* Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleLogoClick}
        >
          <img src={logo} alt={appName} className="h-12 md:h-14 w-auto" />
          <span className="text-xl font-bold md:text-2xl hover:text-indigo-400">
            {appName}
          </span>
        </div>

        {/* Auth & Admin Section */}
        <div className="flex items-center gap-4">
          {authStatus ? (
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold hidden md:block">
                Hello, {userName}
              </span>
              <button
                onClick={adminPanelClickHandler}
                className="px-4 py-2 text-lg font-medium bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300"
              >
                Admin Panel
              </button>
              <LogoutBtn />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
