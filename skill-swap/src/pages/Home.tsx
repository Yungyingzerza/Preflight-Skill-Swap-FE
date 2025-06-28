import Navbar from "@components/Navbar";
import discussingImage from "@assets/business-executives-discussing-document.jpg";
import GuitarLesson from "@assets/pexels-cottonbro-4708902.jpg";
import WebDev from "@assets/html-css-collage-concept-with-person.jpg";
import Photography from "@assets/pexels-andre-furtado-43594-1264210.jpg";
import Cooking from "@assets/pexels-conojeghuo-175753.jpg";
import LanguageExchange from "@assets/medium-shot-smiley-friends-with-books.jpg";
import Footer from "@components/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <section className="h-screen w-full flex flex-col justify-center items-center">
        <img
          src={discussingImage}
          alt="Business Executives Discussing Document"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="text-center mt-4 absolute flex flex-col justify-center items-center gap-5">
          <h1 className="archivo-800 text-6xl">
            Unlock Your Potential. Share Your Skills. Connect & Grow.
          </h1>
          <p className="archivo-400 text-[#8C8D8BFF] text-2xl">
            SkillSwap is your vibrant community for learning new talents and
            sharing your expertise. Discover, connect, and thrive through
            meaningful skill exchanges.
          </p>
          <button className="btn btn-primary w-32 inter-500">
            Browse Skills
          </button>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center gap-5 mt-10">
        <h2 className="archivo-700 text-5xl">How SkillSwap Works</h2>

        <div className="flex flex-row gap-10 p-10 justify-center">
          <div className="flex flex-col items-center border border-[#EBEBEAFF] p-5 rounded-lg shadow-sm gap-3 max-w-sm hover:border-primary">
            <svg
              className="w-12 h-12 fill-primary"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 8C17 6.67392 16.4728 5.40253 15.5352 4.46484C14.6561 3.58579 13.4838 3.06719 12.248 3.00586L12 3C10.6739 3 9.40253 3.52716 8.46484 4.46484C7.52716 5.40253 7 6.67392 7 8L7.00781 8.30664C7.04889 9.03628 7.27192 9.85786 8.20703 10.793C8.91592 11.5019 9.62884 12.3995 9.92676 13.5664L9.98047 13.8037L9.99512 13.9053C10.0437 14.4097 9.70387 14.8789 9.19629 14.9805C8.68847 15.082 8.19392 14.7795 8.04492 14.2949L8.01953 14.1963L7.95215 13.9316C7.79026 13.4095 7.46791 12.9295 7.02441 12.4482L6.79297 12.207C5.45276 10.8668 5.08557 9.56625 5.01465 8.46094L5 8C5 6.14348 5.73705 4.36256 7.0498 3.0498C8.36256 1.73705 10.1435 1 12 1L12.3467 1.00879C14.077 1.09452 15.7194 1.819 16.9502 3.0498C18.263 4.36256 19 6.14348 19 8C19 9.53091 18.4159 11.0954 17.2061 12.2061L17.207 12.207C16.4731 12.9409 16.1254 13.4714 15.9805 14.1963C15.8721 14.7377 15.3452 15.0888 14.8037 14.9805C14.2623 14.8721 13.9112 14.3452 14.0195 13.8037C14.2746 12.5287 14.9269 11.659 15.793 10.793L15.8311 10.7568C16.5948 10.0695 17 9.05279 17 8Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M15 17C15.5523 17 16 17.4477 16 18C16 18.5523 15.5523 19 15 19H9C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17H15Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M14 21C14.5523 21 15 21.4477 15 22C15 22.5523 14.5523 23 14 23H10C9.44772 23 9 22.5523 9 22C9 21.4477 9.44772 21 10 21H14Z"
                style={{
                  fillOpacity: 1,
                }}
              />
            </svg>
            <h3 className="archivo-600 text-2xl">Discover Skills</h3>
            <p className="inter-400 text-lg text-[#8C8D8BFF]">
              Explore a diverse range of skills offered by passionate learners
              and experienced mentors.
            </p>
          </div>

          <div className="flex flex-col items-center border border-[#EBEBEAFF] p-5 rounded-lg shadow-sm gap-3 max-w-sm hover:border-primary">
            <svg
              className="w-12 h-12 fill-primary"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 8.5C21 7.30653 20.5256 6.16227 19.6816 5.31836C18.8377 4.47445 17.6935 4 16.5 4C15.7202 4 15.1131 4.10999 14.5518 4.35449C13.984 4.60181 13.4 5.01407 12.707 5.70703C12.3165 6.09756 11.6835 6.09756 11.293 5.70703C10.6 5.01407 10.016 4.60181 9.44824 4.35449C8.88687 4.10999 8.27982 4 7.5 4C6.30653 4 5.16227 4.47445 4.31836 5.31836C3.47445 6.16227 3 7.30653 3 8.5C3 10.116 3.91951 11.4583 5.15039 12.7363L12 19.5859L18.2998 13.2861L18.8447 12.7354C20.0754 11.446 21 10.1064 21 8.5ZM23 8.5C23 11.2396 21.1925 13.2488 19.7061 14.7061L19.707 14.707L12.707 21.707C12.3165 22.0976 11.6835 22.0976 11.293 21.707L4.30469 14.7188L3.73047 14.1465C2.37747 12.749 1 10.9088 1 8.5C1 6.77609 1.68433 5.12231 2.90332 3.90332C4.12231 2.68433 5.77609 2 7.5 2C8.48018 2 9.37344 2.14001 10.2471 2.52051C10.8603 2.78761 11.4318 3.16121 12 3.6416C12.5682 3.16121 13.1397 2.78761 13.7529 2.52051C14.6266 2.14001 15.5198 2 16.5 2C18.2239 2 19.8777 2.68433 21.0967 3.90332C22.3157 5.12231 23 6.77609 23 8.5Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M16.0053 7.47856C16.9524 7.47863 17.8655 7.83052 18.5678 8.46587H18.5687L21.5287 11.126C21.9394 11.4951 21.9728 12.1274 21.6039 12.5381C21.2349 12.9488 20.6026 12.9831 20.1918 12.6143L17.2318 9.95415L17.2279 9.95024C16.8932 9.64658 16.4572 9.47863 16.0053 9.47856C15.5551 9.47856 15.1198 9.64411 14.7855 9.94536L14.7865 9.94634L12.7162 11.8467L12.7074 11.8545C11.4475 12.9841 9.53321 12.9479 8.33242 11.7471L8.33339 11.7461C8.03795 11.4521 7.80223 11.1036 7.64199 10.7188C7.48123 10.3327 7.39882 9.91828 7.39882 9.50005C7.39882 9.08181 7.48123 8.6674 7.64199 8.2813C7.80274 7.89525 8.03857 7.54467 8.33535 7.25005L11.2934 4.29302L11.3685 4.22466C11.7613 3.904 12.3412 3.92679 12.7074 4.29302C13.0733 4.65908 13.0959 5.2382 12.7758 5.63091L12.7074 5.70708L9.74453 8.66997C9.63504 8.7787 9.54798 8.90837 9.48867 9.05083C9.42945 9.19321 9.39882 9.34584 9.39882 9.50005C9.39882 9.65425 9.42945 9.80688 9.48867 9.94927C9.53315 10.0561 9.59298 10.1562 9.6664 10.2452L9.74453 10.3301L9.74746 10.3331L9.83242 10.4102C10.2736 10.7732 10.9223 10.7688 11.3725 10.3653L13.434 8.47368L13.4379 8.46977L13.5727 8.35356C14.2558 7.7893 15.1156 7.47856 16.0053 7.47856Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M15.293 12.293C15.6591 11.9269 16.2381 11.9043 16.6309 12.2246L16.707 12.293L18.707 14.293L18.7754 14.3692C19.0957 14.7619 19.0731 15.3409 18.707 15.707C18.3409 16.0732 17.7619 16.0958 17.3691 15.7754L17.293 15.707L15.293 13.707L15.2246 13.6309C14.9043 13.2381 14.9269 12.6591 15.293 12.293Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M12.293 15.293C12.6591 14.9269 13.2381 14.9043 13.6309 15.2246L13.707 15.293L15.707 17.293L15.7754 17.3692C16.0957 17.7619 16.0731 18.3409 15.707 18.707C15.3409 19.0732 14.7619 19.0958 14.3691 18.7754L14.293 18.707L12.293 16.707L12.2246 16.6309C11.9043 16.2381 11.9269 15.6591 12.293 15.293Z"
                style={{
                  fillOpacity: 1,
                }}
              />
            </svg>
            <h3 className="archivo-600 text-2xl">Connect & Swap</h3>
            <p className="inter-400 text-lg text-[#8C8D8BFF]">
              Find perfect matches based on your learning and teaching
              preferences. Connect easily.
            </p>
          </div>

          <div className="flex flex-col items-center border border-[#EBEBEAFF] p-5 rounded-lg shadow-sm gap-3 max-w-sm hover:border-primary">
            <svg
              className="w-12 h-12 fill-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1226 1.00463C12.3659 1.0245 12.6004 1.10396 12.8062 1.2351L12.9068 1.30444L13.0015 1.38256C13.1833 1.5454 13.3221 1.75038 13.4068 1.97924L13.4449 2.09545L13.4507 2.11498L15.0318 8.25072H15.0308C15.0755 8.42361 15.1663 8.58149 15.2925 8.70776C15.4188 8.83398 15.5767 8.92385 15.7496 8.9685L21.8843 10.5496L21.9009 10.5544C22.1778 10.6308 22.4258 10.7846 22.6168 10.9968L22.6959 11.0915L22.7662 11.1921C22.9198 11.4325 23.0025 11.7127 23.0025 11.9997C23.0025 12.328 22.8947 12.6477 22.6959 12.9089C22.5219 13.1374 22.2862 13.3107 22.0181 13.4089L21.9009 13.446C21.8955 13.4475 21.8898 13.4485 21.8843 13.4499L15.7496 15.031C15.5766 15.0756 15.4189 15.1664 15.2925 15.2927C15.1664 15.4189 15.0755 15.5761 15.0308 15.7488L15.0318 15.7497L13.4498 21.8845L13.4439 21.904C13.3557 22.2193 13.1666 22.4972 12.9058 22.6951C12.645 22.8929 12.3269 23.0007 11.9996 23.0007C11.6723 23.0007 11.3541 22.8928 11.0933 22.6951C10.8652 22.522 10.6912 22.2882 10.5923 22.0212L10.5552 21.904C10.5534 21.8975 10.5511 21.8911 10.5494 21.8845L8.96832 15.7497C8.92369 15.5768 8.83383 15.419 8.70758 15.2927C8.61271 15.1979 8.50001 15.1231 8.37653 15.073L8.25055 15.031L2.11578 13.449L2.09235 13.4431C1.77835 13.354 1.50203 13.1644 1.30524 12.904C1.13303 12.6762 1.02947 12.4048 1.00641 12.1218L1.00153 11.9997L1.00641 11.8777C1.02955 11.5948 1.13313 11.3232 1.30524 11.0955L1.38239 11.0017C1.57142 10.7898 1.81755 10.6354 2.09235 10.5574L2.11481 10.5505L8.25055 8.96752L8.37653 8.92553C8.49992 8.87546 8.61275 8.80154 8.70758 8.70678C8.83366 8.58078 8.92351 8.42323 8.96832 8.25072L10.5504 2.11498L10.5562 2.09545C10.6444 1.78025 10.8335 1.50226 11.0943 1.30444L11.1939 1.2351C11.4342 1.08187 11.7139 0.999748 12.0005 0.999748L12.1226 1.00463ZM10.9048 8.74975V8.75072C10.7707 9.26938 10.5006 9.74313 10.1216 10.1218C9.78998 10.4532 9.3854 10.7009 8.94196 10.8474L8.74957 10.904L4.50348 11.9988L8.74957 13.0945L8.94196 13.1511C9.3857 13.2978 9.78987 13.5469 10.1216 13.8787C10.5005 14.2576 10.7709 14.7309 10.9048 15.2497L10.9058 15.2507L11.9986 19.4958L13.0943 15.2507V15.2497L13.1509 15.0574C13.2976 14.6139 13.5469 14.2103 13.8785 13.8787C14.2576 13.4996 14.7314 13.2284 15.2505 13.0945L19.4976 11.9997L15.2505 10.905C14.7315 10.7711 14.2575 10.5008 13.8785 10.1218C13.5467 9.79007 13.2976 9.38583 13.1509 8.94213L13.0943 8.74975L11.9996 4.50268L10.9048 8.74975Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M19 7V3C19 2.44772 19.4477 2 20 2C20.5523 2 21 2.44772 21 3V7C21 7.55228 20.5523 8 20 8C19.4477 8 19 7.55228 19 7Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M22 4C22.5523 4 23 4.44772 23 5C23 5.55228 22.5523 6 22 6H18C17.4477 6 17 5.55228 17 5C17 4.44772 17.4477 4 18 4H22Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M3 19V17C3 16.4477 3.44772 16 4 16C4.55228 16 5 16.4477 5 17V19C5 19.5523 4.55228 20 4 20C3.44772 20 3 19.5523 3 19Z"
                style={{
                  fillOpacity: 1,
                }}
              />
              <path
                d="M5 17C5.55228 17 6 17.4477 6 18C6 18.5523 5.55228 19 5 19H3C2.44772 19 2 18.5523 2 18C2 17.4477 2.44772 17 3 17H5Z"
                style={{
                  fillOpacity: 1,
                }}
              />
            </svg>
            <h3 className="archivo-600 text-2xl">Grow Together</h3>
            <p className="inter-400 text-lg text-[#8C8D8BFF]">
              Exchange knowledge, grow your abilities, and build a supportive
              community around shared interests.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center gap-5 mt-10">
        <h2 className="archivo-700 text-5xl">Explore Popular Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10">
          <div className="card bg-base-100 image-full w-96 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
            <figure>
              <img src={GuitarLesson} alt="Guitar Lesson" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl">Guitar Lesson</h2>
            </div>
          </div>

          <div className="card bg-base-100 image-full w-96 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
            <figure>
              <img src={WebDev} alt="Web Development" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl">Web Development</h2>
            </div>
          </div>

          <div className="card bg-base-100 image-full w-96 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
            <figure>
              <img src={Photography} alt="Photography" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl">Photography</h2>
            </div>
          </div>

          <div className="card bg-base-100 image-full w-96 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
            <figure>
              <img src={Cooking} alt="Cooking" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl">Cooking</h2>
            </div>
          </div>

          <div className="card bg-base-100 image-full w-96 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
            <figure>
              <img src={LanguageExchange} alt="Language Exchange" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl">Language Exchange</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center gap-10 mt-10 mb-10">
        <h2 className="archivo-700 text-5xl">
          Ready to Start Your SkillSwap Journey?
        </h2>
        <button className="btn btn-primary w-1/5 text-lg inter-400">
          Join the Community
        </button>
      </section>
      <Footer />
    </>
  );
}
