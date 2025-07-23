import { useState } from "react";
import { login, register } from "@hooks/useAuth";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import SideImage from "@assets/person-sitting-front-desk-typing-keyboard-laptop.jpg";
import { useDispatch } from "react-redux";
import {
  setEmail as setEmailData,
  setFirstName,
  setId,
  setLastName,
  setPictureUrl,
} from "@store/userSlice";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      //validate firstname and lastname
      if (!firstname || !lastname) {
        setErrorMessage("Firstname and lastname are required.");
        return;
      }

      //validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }

      //validate password strength
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }

      setErrorMessage("");

      const response = await register(firstname, lastname, email, password);

      if (response) {
        dispatch(setId(response.id));
        dispatch(setFirstName(response.firstname));
        dispatch(setLastName(response.lastname));
        dispatch(setEmailData(response.email));
        dispatch(setPictureUrl(response.picture_url));
      }

      //clear
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      //validate email and password
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        return;
      }

      //validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }

      //validate password strength
      if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }

      setErrorMessage("");

      const response = await login(email, password);

      if (response) {
        dispatch(setId(response.id));
        dispatch(setFirstName(response.firstname));
        dispatch(setLastName(response.lastname));
        dispatch(setEmailData(response.email));
        dispatch(setPictureUrl(response.picture_url));
      }

      //clear
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full h-[calc(100vh-64px)]">
        <section className="h-full w-full flex-1 flex items-center justify-center">
          {isRegisterPage ? (
            <div className=" p-8 rounded-lg md:shadow-lg w-1/2 max-w-sm min-w-xs flex flex-col gap-4">
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-center archivo-700">
                  Create an Account
                </h1>
                <span className="text-sm archivo-400 text-[#8C8D8BFF] text-center">
                  Join SkillSwap to connect with others and share your skills.
                </span>
              </div>
              {errorMessage && (
                <div className="alert alert-error">
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className="w-full">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Firstname</legend>
                  <label className="input validator w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="h-[1em] opacity-50"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </label>
                  <div className="validator-hint hidden">
                    Enter valid firstname
                  </div>
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Lastname</legend>
                  <label className="input validator w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="h-[1em] opacity-50"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </label>
                  <div className="validator-hint hidden">
                    Enter valid lastname
                  </div>
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Email</legend>
                  <label className="input validator w-full">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <div className="validator-hint hidden">
                    Enter valid email address
                  </div>
                </fieldset>
                <fieldset className="fieldset w-full">
                  <div className="flex flex-row justify-between items-center">
                    <legend className="fieldset-legend">Password</legend>
                    {isShowPassword ? (
                      <legend
                        className="fieldset-legend text-primary cursor-pointer"
                        onClick={() => setIsShowPassword(false)}
                      >
                        Hide password
                      </legend>
                    ) : (
                      <legend
                        className="fieldset-legend text-primary cursor-pointer"
                        onClick={() => setIsShowPassword(true)}
                      >
                        Show password
                      </legend>
                    )}
                  </div>
                  <label className="input validator w-full">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      required
                      minLength={8}
                      placeholder="•••••••••"
                      pattern="(.{8,})"
                      title="Must be at least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Must be at least 8 characters
                  </p>
                </fieldset>
              </div>
              <button className="btn btn-primary" onClick={handleRegister}>
                <div className="flex flex-row justify-center items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  <span>Create Account</span>
                </div>
              </button>
              <div>
                <p className="text-center text-sm archivo-400 text-[#8C8D8BFF]">
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => setIsRegisterPage(false)}
                  >
                    Sign In
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className=" p-8 rounded-lg md:shadow-lg w-1/2 max-w-sm min-w-xs flex flex-col gap-4">
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl font-bold text-center archivo-700">
                  Sign In to SkillSwap
                </h1>
                <span className="text-sm archivo-400 text-[#8C8D8BFF] text-center">
                  Access your account and start exchanging skills.
                </span>
              </div>
              {errorMessage && (
                <div className="alert alert-error">
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className="w-full">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Email</legend>
                  <label className="input validator w-full">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </g>
                    </svg>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <div className="validator-hint hidden">
                    Enter valid email address
                  </div>
                </fieldset>
                <fieldset className="fieldset w-full">
                  <div className="flex flex-row justify-between items-center">
                    <legend className="fieldset-legend">Password</legend>
                    <legend className="fieldset-legend text-primary cursor-pointer">
                      Forgot password?
                    </legend>
                  </div>
                  <label className="input validator w-full">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="•••••••••"
                      pattern=".{8,}"
                      title="Must be at least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <p className="validator-hint hidden">
                    Must be at least 8 characters
                  </p>
                </fieldset>
              </div>
              <button className="btn btn-primary" onClick={handleLogin}>
                <div className="flex flex-row justify-center items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  <span>Sign in</span>
                </div>
              </button>
              <div>
                <p className="text-center text-sm archivo-400 text-[#8C8D8BFF]">
                  Don't have an account?{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => {
                      setErrorMessage("");
                      setIsRegisterPage(true);
                    }}
                  >
                    Create One
                  </span>
                </p>
              </div>
            </div>
          )}
        </section>
        <section className="h-full flex-1 hidden lg:block">
          <div className="flex flex-row justify-end items-end h-full w-full p-8">
            <img
              src={SideImage}
              className="h-full w-1/2 rounded-lg shadow-2xl object-cover mr-10"
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
