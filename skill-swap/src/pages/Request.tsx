import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import RequestUser from "@components/RequestUser";

export default function RequestPage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-7 w-full md:p-10">
        <div className="flex flex-row w-full h-full gap-15">
          <div className="hidden md:flex flex-col gap-5">
            <h1 className="archivo-700 text-2xl">Request Dashboard</h1>

            <div className="flex flex-col border border-[#E5E5E5] rounded-lg p-4 gap-5">
              <div className="flex flex-row justify-between  items-center">
                <span className="inter-500 text-sm text-gray-500">
                  Pending Requests
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6 stroke-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <span className="archivo-700 text-2xl">7</span>
            </div>

            <div className="flex flex-col border border-[#E5E5E5] rounded-lg p-4 gap-5">
              <div className="flex flex-row justify-between  items-center">
                <span className="inter-500 text-sm text-gray-500">
                  Accepted Swaps
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6 stroke-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <span className="archivo-700 text-2xl">12</span>
            </div>

            <div className="flex flex-col border border-[#E5E5E5] rounded-lg p-4 gap-5">
              <div className="flex flex-row justify-between  items-center">
                <span className="inter-500 text-sm text-gray-500">
                  Rejected Requests
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6 stroke-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <span className="archivo-700 text-2xl">3</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-10">
            <h1 className="archivo-700 text-2xl p-5 md:p-0">
              Incoming Skill Swap Requests
            </h1>
            <div className="flex flex-row gap-5 flex-wrap justify-center md:justify-start">
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
              <RequestUser />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
