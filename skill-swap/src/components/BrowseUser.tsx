export default function BrowseUser() {
  return (
    <>
      <div className="flex flex-row border border-[#E5E5E5] shadow-sm rounded-lg p-7 gap-4 items-center w-full">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="inter-600 text-lg">Yelling Cat</h2>
          <div className="flex flex-row flex-wrap gap-2">
            <div className="badge badge-soft badge-error rounded-xl text-xs">
              Web Development
            </div>
            <div className="badge badge-soft badge-error rounded-xl text-xs">
              UX/UI Design
            </div>
            <div className="badge badge-soft badge-error rounded-xl text-xs">
              Cooking
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
