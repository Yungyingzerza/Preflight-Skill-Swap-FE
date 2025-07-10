import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BrowseUser from "@components/BrowseUser";
import { search, getTargetUserData } from "@hooks/useBrowse";
import { useCallback, useEffect, useState } from "react";
import type { IUser } from "@interfaces/IUser";
import type { ISkill } from "@interfaces/ISkill";

interface ResultItem {
  id: string;
  user_id: string;
  skill_id: string;
  createdAt: string;
  updatedAt: string;
  User: IUser;
  Skill: ISkill;
}

interface MergedUserSkills {
  user_id: string;
  user: IUser;
  skills: ISkill[];
}

interface targetUserData extends IUser {
  UserSkills: {
    skill_id: string;
    Skill: ISkill;
  }[];
  UserSkillLearns: {
    skill_id: string;
    Skill: ISkill;
  }[];
}

export default function Browse() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<MergedUserSkills[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [targetUserData, setTargetUserData] = useState<targetUserData | null>(
    null
  );

  useEffect(() => {
    if (!selectedUser) return;

    const abortController = new AbortController();

    const fetchTargetUserData = async () => {
      try {
        const data = await getTargetUserData(
          selectedUser.id,
          abortController.signal
        );
        setTargetUserData(data);
      } catch (error) {
        console.error("Error fetching target user data:", error);
      }
    };

    fetchTargetUserData();

    return () => {
      abortController.abort(); // Clean up the fetch request on component unmount
    };
  }, [selectedUser]);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    try {
      const results = await search(searchInput);
      //If found same User id, merge skills
      const mergedResults = results.reduce(
        (acc: MergedUserSkills[], item: ResultItem) => {
          const existingUser = acc.find(
            (user) => user.user_id === item.user_id
          );
          if (existingUser) {
            // Merge skills if user already exists
            existingUser.skills.push(item.Skill);
          } else {
            // Create a new user entry
            acc.push({
              user_id: item.user_id,
              user: {
                id: item.User.id,
                firstname: item.User.firstname,
                lastname: item.User.lastname,
                picture_url: item.User.picture_url,
              },
              skills: [item.Skill],
            });
          }
          return acc;
        },
        []
      );
      setSearchResults(mergedResults);
    } catch (error) {
      console.error("Search error:", error);
      // Handle error (e.g., show error message to user)
    }
  }, [searchInput]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-7 w-full md:p-10">
        <section className="flex flex-col items-center justify-center">
          <h1 className="archivo-800 text-4xl">
            Discover Your Next Skill Partner
          </h1>
        </section>

        <section className="flex flex-row items-center gap-2 rounded-lg p-7 shadow-md">
          <label className="input flex-1">
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
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Search skills or users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </section>

        {searchResults.length > 0 ? (
          <section className="flex flex-row gap-20 flex-wrap justify-between">
            <div className="flex flex-col gap-5 w-full lg:w-1/2">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <BrowseUser
                    key={result.user_id}
                    User={result.user}
                    skills={result.skills}
                    setSelectedUser={setSelectedUser}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No results found. Try a different search.
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 rounded-lg shadow-2xl">
              {targetUserData && selectedUser ? (
                <>
                  <div className="relative w-full h-48">
                    <img
                      src="https://images.unsplash.com/photo-1601425276965-bdb69f1f3977?q=100"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-white/70 to-transparent pointer-events-none"></div>
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="avatar relative -mt-12">
                      <div className="w-32 rounded-full">
                        <img
                          src={targetUserData.picture_url}
                          alt={`${targetUserData.firstname} ${targetUserData.lastname}`}
                        />
                      </div>
                    </div>
                    <h2 className="archivo-700 text-3xl">
                      {targetUserData.firstname} {targetUserData.lastname}
                    </h2>
                  </div>
                  <div className="flex flex-row gap-10 p-10">
                    <div className="flex flex-col w-1/2 gap-2">
                      <div className="flex flex-row gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-7 stroke-error"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                          />
                        </svg>
                        <span className="archivo-700 text-xl">
                          Skills to Teach
                        </span>
                      </div>

                      {targetUserData.UserSkills.map((skill) => (
                        <div
                          key={skill.skill_id}
                          className="flex flex-row gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 stroke-error"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <span className="inter-400">{skill.Skill.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Skill to Learn */}

                    <div className="flex flex-col w-1/2 gap-2">
                      <div className="flex flex-row gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-6 stroke-accent"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                          />
                        </svg>

                        <span className="archivo-700 text-xl">
                          Skills to Learn
                        </span>
                      </div>

                      {targetUserData.UserSkillLearns.map((skill) => (
                        <div
                          key={skill.skill_id}
                          className="flex flex-row gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 stroke-accent"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <span className="inter-400">{skill.Skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-10">
                    <div className="flex flex-row gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 stroke-warning"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                        />
                      </svg>
                      <span className="archivo-700 text-xl">About Me</span>
                    </div>
                    <p>{targetUserData.bio || "No description provided."}</p>
                  </div>

                  <button className="btn btn-primary rounded-t-none">
                    Request Swap
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-10">
                  <p className="text-gray-500">Select a user to view details</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center p-10">
            <p className="text-gray-500">No search results found.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
