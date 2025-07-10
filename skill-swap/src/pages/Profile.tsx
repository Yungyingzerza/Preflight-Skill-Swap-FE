import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { useSelector } from "react-redux";
import type { IUser } from "@interfaces/IUser";
import type { IUserSkill } from "@interfaces/IUserSkill";
import { useEffect, useState, useCallback } from "react";
import {
  getUserSkills,
  getUserSkillLearn,
  getNumberOfUserSkills,
  editUserSkills,
  editUserSkillsLearn,
} from "@hooks/useMainPage";
export default function Profile() {
  const user = useSelector((state: { user: IUser }) => state.user);
  const [MySkillsMode, setMySkillsMode] = useState<"offered" | "learned">(
    "offered"
  );

  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [userSkills, setUserSkills] = useState<{ id: string; name: string }[]>(
    []
  );
  const [userSkillsLearned, setUserSkillsLearned] = useState<
    { id: string; name: string }[]
  >([]); // State to hold learned skills
  // State to hold the number of skills offered and swaps completed

  const [numberSwapsCompleted, setNumberSwapsCompleted] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    // Fetch user skills when the component mounts
    const fetchUserSkills = async () => {
      try {
        const skills = await getUserSkills(abortController.signal);

        setUserSkills(
          skills.map((skill: IUserSkill) => ({
            id: skill.Skill.id,
            name: skill.Skill.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };

    const fetchUserSkillsLearned = async () => {
      try {
        const skillsLearned = await getUserSkillLearn(abortController.signal);

        setUserSkillsLearned(
          skillsLearned.map((skill: IUserSkill) => ({
            id: skill.Skill.id,
            name: skill.Skill.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch user skills learned:", error);
      }
    };

    const fetchNumberOfSkills = async () => {
      try {
        const numberOfSkills = await getNumberOfUserSkills(
          abortController.signal
        );

        setNumberSwapsCompleted(numberOfSkills.swapCompletedCount);
      } catch (error) {
        console.error("Failed to fetch number of user skills:", error);
      }
    };
    fetchNumberOfSkills();
    fetchUserSkillsLearned();
    fetchUserSkills();

    return () => {
      abortController.abort(); // Clean up the abort controller on unmount
    };
  }, []);

  const handleOpenModal = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      (document.getElementById("skill-modal") as HTMLDialogElement).showModal();

      const res = await fetch(`${import.meta.env.VITE_BASE_API}/skill`, {
        credentials: "include", // Include cookies in the request
      });

      const data = await res.json();

      setSkills(data);
    },
    [skills.length] // Dependency array to re-fetch skills when skills state changes
  );

  const handleCheckboxChange = useCallback(
    (skillId: string, skillName: string, isChecked: boolean) => {
      if (isChecked) {
        if (MySkillsMode === "offered") {
          setUserSkills((prev) => [
            ...prev,
            {
              id: skillId,
              name: skillName,
            },
          ]);
        } else {
          setUserSkillsLearned((prev) => [
            ...prev,
            {
              id: skillId,
              name: skillName,
            },
          ]);
        }
      } else {
        if (MySkillsMode === "offered") {
          setUserSkills((prev) => prev.filter((skill) => skill.id !== skillId));
        } else {
          setUserSkillsLearned((prev) =>
            prev.filter((skill) => skill.id !== skillId)
          );
        }
      }
    },
    [MySkillsMode]
  );

  const handleCloseModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      (document.getElementById("skill-modal") as HTMLDialogElement).close();

      if (MySkillsMode === "offered") {
        //convert to [{ skills: { id: string }[] }
        const userSkillsOffered = userSkills.map((skill) => ({
          id: skill.id,
        }));
        editUserSkills({ skills: userSkillsOffered });
      } else {
        const userSkillsNeed = userSkillsLearned.map((skill) => ({
          id: skill.id,
        }));
        editUserSkillsLearn({ skills: userSkillsNeed });
      }
    },
    [MySkillsMode, userSkills, userSkillsLearned] // Dependencies to ensure the latest state is used
  ); // Placeholder for close modal logic

  return (
    <>
      <Navbar />
      <dialog id="skill-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {MySkillsMode === "offered" ? "Skills Offered" : "Skills Learned"}
          </h3>
          <div className="py-4">
            {/* List all skills can choose from server and has check if already has uncheck if dont have */}
            <div className="flex flex-col gap-2">
              {/* Check offered or learned */}
              {skills.map((skill) => (
                <div key={skill.id} className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">{skill.name}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      value={skill.id}
                      // Logic to check if the user already has this skill
                      checked={
                        MySkillsMode === "offered"
                          ? userSkills.some((s) => s.id === skill.id)
                          : userSkillsLearned.some((s) => s.id === skill.id)
                      }
                      onChange={(e) =>
                        handleCheckboxChange(
                          skill.id,
                          skill.name,
                          e.target.checked
                        )
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleCloseModal}>
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="flex flex-col gap-7 w-full md:p-10">
        <section className="flex flex-row w-full p-10 shadow-md rounded-md gap-5 border border-[#E5E5E5] flex-wrap">
          <div>
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={user.picture_url} />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <h1 className="text-4xl font-bol archivo-800">
              {user.firstname} {user.lastname}
            </h1>
            <span className="inter-400 text-lg text-[#8C8D8BFF]">
              {user.bio || "No bio available"}
            </span>
            <div className="flex flex-row gap-2 mt-5">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-4xl text-primary archivo-700">
                  {userSkills.length}
                </span>
                <span className="inter-400 text-[#8C8D8BFF] text-sm">
                  Skills Offered
                </span>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <span className="text-4xl text-primary archivo-700">
                  {numberSwapsCompleted}
                </span>
                <span className="inter-400 text-[#8C8D8BFF] text-sm">
                  Swaps Completed
                </span>
              </div>
            </div>
          </div>
          <div className="md:w-40 w-full">
            <button className="btn inter-500 text-sm flex flex-row gap-2 justify-center items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <span>Edit Profile</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col w-full p-10 shadow-md rounded-md gap-5 border border-[#E5E5E5]">
          <div className="flex flex-col gap-1">
            <span className="archivo-700 text-2xl">My Skills</span>
            <span className="inter-400 text-sm text-[#8C8D8BFF]">
              Manage your skill set for swaps.
            </span>
          </div>
          <div className="flex flex-row w-full">
            <button
              className={`btn rounded-r-none flex-1 transition-colors duration-400 inter-500 text-sm  ${
                MySkillsMode === "offered" ? "bg-white" : "text-[#8C8D8BFF]"
              }`}
              onClick={() => setMySkillsMode("offered")}
            >
              Skills Offered
            </button>
            <button
              className={`btn rounded-l-none w-1/2 transition-colors duration-400 inter-500 text-sm  ${
                MySkillsMode === "learned" ? "bg-white" : "text-[#8C8D8BFF]"
              }`}
              onClick={() => setMySkillsMode("learned")}
            >
              Skills Learned
            </button>
          </div>
          <div className="flex flex-row flex-wrap gap-5 ">
            {MySkillsMode === "offered" ? (
              userSkills.length > 0 ? (
                userSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="badge badge-soft badge-primary rounded-xl text-xs"
                  >
                    {skill.name}
                  </div>
                ))
              ) : (
                <span className="inter-400 text-[#8C8D8BFF]">
                  No skills offered yet.
                </span>
              )
            ) : userSkillsLearned.length > 0 ? (
              userSkillsLearned.map((skill) => (
                <div
                  key={skill.id}
                  className="badge badge-soft badge-primary rounded-xl text-xs"
                >
                  {skill.name}
                </div>
              ))
            ) : (
              <span className="inter-400 text-[#8C8D8BFF]">
                No skills learned yet.
              </span>
            )}
          </div>
          <div className="flex flex-row flex-wrap md:justify-end w-full">
            <button
              className="btn btn-primary text-sm inter-500 w-full md:w-auto"
              onClick={handleOpenModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              Add/Edit Skills
            </button>
          </div>
        </section>

        <section className="flex flex-col w-full p-10 shadow-md rounded-md gap-5 border border-[#E5E5E5]">
          <div className="flex flex-col gap-1">
            <span className="archivo-700 text-2xl">Swap History</span>
            <span className="inter-400 text-sm text-[#8C8D8BFF]">
              Overview of your past skill exchange transactions.
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Skill Exchanged</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td className="inter-500">Cy Ganderton</td>
                  <td className="inter-400 text-[#8C8D8BFF]">Advanced SEO</td>
                  <td className="inter-400 text-[#8C8D8BFF]">2025-03-15</td>
                  <td className="inter-400 text-[#8C8D8BFF]">
                    <div className="badge badge-soft badge-success text-xs">
                      Completed
                    </div>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <td className="inter-500">Hart Hagerty</td>
                  <td className="inter-400 text-[#8C8D8BFF]">Video Editing</td>
                  <td className="inter-400 text-[#8C8D8BFF]">2025-03-16</td>
                  <td className="inter-400 text-[#8C8D8BFF]">
                    <div className="badge badge-soft badge-success text-xs">
                      Completed
                    </div>
                  </td>
                </tr>
                {/* row 3 */}
                <tr>
                  <td className="inter-500">Brice Swyre</td>
                  <td className="inter-400 text-[#8C8D8BFF]">Photography</td>
                  <td className="inter-400 text-[#8C8D8BFF]">2025-04-15</td>
                  <td className="inter-400 text-[#8C8D8BFF]">
                    <div className="badge badge-soft badge-success text-xs">
                      Completed
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="inter-500">Alice Bob</td>
                  <td className="inter-400 text-[#8C8D8BFF]">Network</td>
                  <td className="inter-400 text-[#8C8D8BFF]">2025-06-15</td>
                  <td className="inter-400 text-[#8C8D8BFF]">
                    <div className="badge badge-soft badge-warning text-xs">
                      In Progress
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
