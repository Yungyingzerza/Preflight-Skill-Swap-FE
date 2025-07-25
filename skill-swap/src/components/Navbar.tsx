import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "@hooks/useAuth";
import {
  setEmail,
  setFirstName,
  setId,
  setLastName,
  setPictureUrl,
} from "@store/userSlice";
import type { IUser } from "@interfaces/IUser";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: { user: IUser }) => state.user);

  const [currentPage, setCurrentPage] = useState<
    "Home" | "Browse" | "Messages" | "Request" | ""
  >("");

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(setId(""));
      dispatch(setFirstName(""));
      dispatch(setLastName(""));
      dispatch(setEmail(""));
      dispatch(setPictureUrl(""));
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    // Update the current page based on the pathname
    const path = location.pathname;
    if (path === "/") {
      setCurrentPage("Home");
    } else if (path.startsWith("/browse")) {
      setCurrentPage("Browse");
    } else if (path.startsWith("/messages")) {
      setCurrentPage("Messages");
    } else if (path.startsWith("/requests")) {
      setCurrentPage("Request");
    } else {
      setCurrentPage("");
    }
  }, [location.pathname]);

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex-1 flex flex-row items-center gap-2">
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-ghost text-xl"
            >
              SkillSwap
            </button>
            {user?.id && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <a
                    onClick={() => navigate("/")}
                    className={`inter-400 text-sm ${
                      currentPage === "Home" && "text-primary"
                    }`}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigate("/browse")}
                    className={`inter-400 text-sm ${
                      currentPage === "Browse" && "text-primary"
                    }`}
                  >
                    Browse
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigate("/messages")}
                    className={`inter-400 text-sm ${
                      currentPage === "Messages" && "text-primary"
                    }`}
                  >
                    Messages
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigate("/requests")}
                    className={`inter-400 text-sm ${
                      currentPage === "Request" && "text-primary"
                    }`}
                  >
                    Requests Swap
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {user?.id ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt={`${user.firstname} ${user.lastname}`}
                    src={user.picture_url}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
