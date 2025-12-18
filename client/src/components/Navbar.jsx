import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const availablePoints = user
    ? user.points - (user.lockedPoints || 0)
    : 0;

  const linkClasses = (path) =>
    `relative font-medium transition-all duration-300
     ${
       location.pathname === path
         ? "text-blue-700"
         : "text-gray-700 hover:text-blue-600"
     }
     after:content-[''] after:absolute after:left-0 after:-bottom-1
     after:h-[2px] after:w-0 after:bg-blue-500
     after:transition-all after:duration-300
     hover:after:w-full`;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 
                    border-b border-white/30 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">

        {/* LEFT BRANDING + GREETING */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r 
                       from-blue-600 via-purple-500 to-blue-400
                       bg-clip-text text-transparent hover:scale-105 
                       transition-transform duration-300"
          >
            SkillX
          </Link>

          {/* TRANSLUCENT DIVIDER */}
          <div className="h-6 w-[1px] bg-gray-300/50 backdrop-blur-md" />

          {/* GREETING */}
          <span className="text-sm font-medium text-gray-700">
            Hi,{" "}
            <span className="font-semibold text-blue-600">
              {user?.name}
            </span>
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-6 items-center">

          {/* POINTS BADGE */}
          <div className="px-4 py-1 rounded-full text-sm font-semibold
                          bg-blue-100 text-blue-700
                          shadow-inner">
            Available: {availablePoints}
          </div>

          {/* NAV LINKS */}
          <Link to="/" className={linkClasses("/")}>
            Dashboard
          </Link>

          <Link to="/profile" className={linkClasses("/profile")}>
            Profile
          </Link>

          <Link to="/create-project" className={linkClasses("/create-project")}>
            Post Project
          </Link>

          <Link to="/my-work" className={linkClasses("/my-work")}>
            My Work
          </Link>

          <Link to="/my-projects" className={linkClasses("/my-projects")}>
            My Projects
          </Link>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="px-4 py-1 rounded-full text-sm font-semibold
                       bg-red-50 text-red-600
                       hover:bg-red-100 hover:scale-105
                       transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
