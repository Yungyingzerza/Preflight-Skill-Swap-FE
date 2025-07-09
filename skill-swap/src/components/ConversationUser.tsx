export default function ConversationUser() {
  return (
    <>
      <div className="flex flex-row w-full p-1 gap-2 rounded-md hover:bg-gray-100 cursor-pointer">
        <div className="avatar">
          <div className="w-14 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
        <div className="hidden flex-col gap-2 truncate md:flex">
          <span className="text-xl inter-600">Yelling Cat</span>
          <span className="text-sm inter-500 text-gray-500 truncate">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            facilis molestias necessitatibus? Qui, unde enim? Cum minus
            doloremque vitae natus, amet aliquid, consectetur eum voluptatibus
            excepturi fugit quod quae repudiandae!
          </span>
        </div>
      </div>
    </>
  );
}
