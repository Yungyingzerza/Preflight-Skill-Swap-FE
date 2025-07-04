import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@hooks/useAuth";
import {
  setEmail,
  setFirstName,
  setId,
  setLastName,
  setPictureUrl,
} from "@store/userSlice";
import type { IUser } from "@interfaces/IUser";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state: { user: IUser }) => state.user);

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

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
            SkillSwap
          </a>
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
                  <a className="justify-between">Profile</a>
                </li>
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
