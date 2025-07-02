import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import { useSelector } from "react-redux";
import type { IUser } from "@interfaces/IUser";
function App() {
  const user = useSelector((state: { user: IUser }) => state.user);
  return (
    <>
      {user?.id ? (
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
      )}
    </>
  );
}

export default App;
