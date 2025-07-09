export default function RequestUser() {
  return (
    <>
      <div className="flex flex-col gap-5 border border-[#E5E5E5] rounded-lg p-4 min-w-64">
        <div className="flex flex-row gap-2 items-center">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          <span className="archivo-600 text-lg">John Doe</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inter-500 text-sm">Offer:</span>
          <div className="badge badge-soft badge-primary rounded-xl text-xs">
            Digital Marketing
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="inter-500 text-sm">Request:</span>
          <div className="badge badge-soft badge-error rounded-xl text-xs">
            Web Dev
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-end">
          <button className="btn btn-primary inter-500 text-sm">Accept</button>
          <button className="btn inter-500 text-sm">Reject</button>
        </div>
      </div>
    </>
  );
}
