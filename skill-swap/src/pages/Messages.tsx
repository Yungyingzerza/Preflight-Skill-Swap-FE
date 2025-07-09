import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ConversationUser from "@components/ConversationUser";
import { useEffect, useRef } from "react";

export default function Messages() {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat when the component mounts or updates
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef.current]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-7 w-full md:p-10 ">
        <div className="flex flex-row w-full border border-[#E5E5E5] shadow-lg h-[75vh] rounded-lg">
          <div className="flex flex-col w-32 md:w-72 border-r border-[#E5E5E5] p-5 gap-5">
            <div className="flex flex-row gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-6 stroke-primary hidden md:block "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              <span className="text-lg md:text-xl archivo-700">Messages</span>
            </div>
            <div className="flex flex-col gap-5 overflow-y-auto h-full">
              <ConversationUser />
              <ConversationUser />
              <ConversationUser />
              <ConversationUser />
              <ConversationUser />
              <ConversationUser />
            </div>

            <div className="flex-1"></div>
            <button className="btn btn-primary ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hidden md:block "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>

              <span className="inter-500 text-xs md:text-sm ">
                New Conversation
              </span>
            </button>
          </div>

          <div className="flex flex-col w-full ">
            <div className="flex flex-row gap-2 border-b border-[#E5E5E5] p-4 items-center w-full">
              <div className="avatar">
                <div className="w-14 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <span className="archivo-700 text-lg">Yelling Cat</span>
            </div>

            <div
              ref={chatRef}
              className="w-full h-full flex flex-col gap-4 p-5 overflow-y-auto"
            >
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Obi-Wan Kenobi</div>
                <div className="chat-bubble">You were the Chosen One!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:45</time>
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Anakin</div>
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:46</time>
                </div>
              </div>
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Obi-Wan Kenobi</div>
                <div className="chat-bubble">You were the Chosen One!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:45</time>
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Anakin</div>
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:46</time>
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Anakin</div>
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:46</time>
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">Anakin</div>
                <div className="chat-bubble">I hate you!</div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">12:46</time>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2 p-2 items-center w-full border-t border-[#E5E5E5]">
              <input
                type="text"
                placeholder="Type your message..."
                className="input flex-1 rounded-3xl"
              />
              <button className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
