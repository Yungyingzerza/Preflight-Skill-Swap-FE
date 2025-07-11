import type { ISkill } from "@interfaces/ISkill";

export default function RequestUser(props: {
  offerId: string;
  firstname: string;
  lastname: string;
  picture_url: string;
  offerSkill: { Skill: ISkill }[];
  requestSkill: ISkill;
  onAccept: (offerId: string, skillId: string) => void;
  onReject: (offerId: string) => void;
}) {
  const { firstname, lastname, picture_url, offerSkill, requestSkill } = props;

  return (
    <>
      <dialog id="accept-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Choose a Skill to Request</h3>
          <div className="py-4 flex flex-row flex-wrap justify-center">
            {/* list all target user skill from UserSkill */}
            {offerSkill.map((skill) => (
              <button
                key={skill.Skill.id}
                className="btn btn-outline btn-primary m-2"
                onClick={() => props.onAccept(props.offerId, skill.Skill.id)}
              >
                {skill.Skill.name}
              </button>
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="flex flex-col gap-5 border border-[#E5E5E5] rounded-lg p-4 min-w-64">
        <div className="flex flex-row gap-2 items-center">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={picture_url} alt={`${firstname} ${lastname}`} />
            </div>
          </div>
          <span className="archivo-600 text-lg">
            {firstname} {lastname}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inter-500 text-sm">Offer:</span>

          {offerSkill.map((skill, index) => (
            <div
              key={index}
              className="badge badge-soft badge-primary rounded-xl text-xs"
            >
              {skill.Skill.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span className="inter-500 text-sm">Request:</span>
          {
            /* Assuming requestSkill is a single skill, adjust as necessary */
            requestSkill && (
              <div className="badge badge-soft badge-error rounded-xl text-xs">
                {requestSkill.name}
              </div>
            )
          }
        </div>
        <div className="flex flex-row gap-2 justify-end">
          <button
            className="btn btn-primary inter-500 text-sm"
            onClick={() =>
              (
                document.getElementById("accept-modal") as HTMLDialogElement
              ).showModal()
            }
          >
            Accept
          </button>
          <button
            className="btn inter-500 text-sm"
            onClick={() => props.onReject(props.offerId)}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
}
