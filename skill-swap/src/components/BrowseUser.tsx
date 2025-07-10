import type { IUser } from "@interfaces/IUser";
import type { ISkill } from "@interfaces/ISkill";

export default function BrowseUser(props: {
  User: IUser;
  skills: ISkill[];
  setSelectedUser?: (user: IUser) => void;
}) {
  const { User, skills, setSelectedUser } = props;
  return (
    <>
      <div
        className="flex flex-row border border-[#E5E5E5] shadow-sm rounded-lg p-7 gap-4 items-center w-full cursor-pointer hover:bg-[#F8F8F8]"
        onClick={() => setSelectedUser && setSelectedUser(User)}
      >
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img
              src={User.picture_url}
              alt={`${User.firstname} ${User.lastname}`}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="inter-600 text-lg">{`${User.firstname} ${User.lastname}`}</h2>
          <div className="flex flex-row flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="badge badge-soft badge-error rounded-xl text-xs"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
