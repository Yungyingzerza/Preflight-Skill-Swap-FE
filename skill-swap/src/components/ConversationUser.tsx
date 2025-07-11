export default function ConversationUser(props: {
  firstname: string;
  lastname: string;
  picture_url: string;
  lastMessage?: string | null;
  onClick: () => void;
}) {
  const { firstname, lastname, picture_url, lastMessage } = props;

  return (
    <>
      <div
        className="flex flex-row w-full p-1 gap-2 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={props.onClick}
      >
        <div className="avatar">
          <div className="w-14 rounded-full">
            <img src={picture_url} alt={`${firstname} ${lastname}`} />
          </div>
        </div>
        <div className="hidden flex-col gap-2 truncate md:flex">
          <span className="text-xl inter-600">
            {firstname} {lastname}
          </span>
          <span className="text-sm inter-500 text-gray-500 truncate">
            {lastMessage ? lastMessage : "No messages yet"}
          </span>
        </div>
      </div>
    </>
  );
}
