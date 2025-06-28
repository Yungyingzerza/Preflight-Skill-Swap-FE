import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import SideImage from "@assets/person-sitting-front-desk-typing-keyboard-laptop.jpg";
export default function Login() {
  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full h-[calc(100vh-64px)]">
        <section className="h-full w-full flex-1 flex items-center justify-center">
          <div className=" p-8 rounded-lg md:shadow-lg w-1/2 max-w-sm min-w-xs flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-2xl font-bold text-center archivo-700">
                Sign In to SkillSwap
              </h1>
              <span className="text-sm archivo-400 text-[#8C8D8BFF] text-center">
                Access your account and start exchanging skills.
              </span>
            </div>
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
                  <input type="email" placeholder="name@example.com" required />
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
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </label>
                <p className="validator-hint hidden">
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
              </fieldset>
            </div>
            <button className="btn btn-primary">
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
                <span className="text-primary cursor-pointer">Create One</span>
              </p>
            </div>
          </div>
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
