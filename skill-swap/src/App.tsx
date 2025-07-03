import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import Loading from "@pages/Loading";
import { useSelector, useDispatch } from "react-redux";
import { isAuth } from "@hooks/useAuth";
import type { IUser } from "@interfaces/IUser";
import { useEffect } from "react";
import {
  setEmail,
  setFirstName,
  setId,
  setLastName,
  setPictureUrl,
  setIsLoaded,
} from "@store/userSlice";
function App() {
  const user = useSelector((state: { user: IUser }) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const abortController = new AbortController();

    const checkAuth = async () => {
      try {
        const response: IUser = await isAuth(abortController.signal);
        if (response?.id) {
          dispatch(setId(response.id));
          dispatch(setFirstName(response.firstname));
          dispatch(setLastName(response.lastname));
          dispatch(setEmail(response.email));
          dispatch(setPictureUrl(response.picture_url));
          dispatch(setIsLoaded(true));
        }
      } catch (error) {
        if (error == "Error: Unauthorized") {
          dispatch(setIsLoaded(true)); // Set loaded to true even if not authenticated
        }
      }
    };

    checkAuth();

    return () => {
      abortController.abort(); // Clean up the abort controller on unmount
    };
  }, []);

  return (
    <>
      {user.isLoaded ? (
        user?.id ? (
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="*" element={<h1 className="text-8xl">?</h1>} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1 className="text-8xl">?</h1>} />
          </Routes>
        )
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
