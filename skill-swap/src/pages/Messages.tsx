import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ConversationUser from "@components/ConversationUser";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  getAllConversations,
  getAllConversationMessages,
  sendMessage,
} from "@hooks/useChat";
import { useSelector } from "react-redux";
import type { IUser } from "@interfaces/IUser";
import io, { Socket } from "socket.io-client";

interface IConversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  Participants: {
    id: string;
    conversation_id: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
  }[];
  participants: {
    User: {
      id: string;
      firstname: string;
      lastname: string;
      picture_url: string;
    };
  }[];
  lastMessage: {
    message?: string | null;
    createdAt?: string | null;
  } | null;
}

interface IMessage {
  id: string;
  message: string;
  is_read: boolean;
  createdAt: string;
  sender_id: string;
  User: {
    id: string;
    firstname: string;
    lastname: string;
    picture_url: string;
  };
}

export default function Messages() {
  const user = useSelector((state: { user: IUser }) => state.user);

  const [socket, setSocket] = useState<Socket | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);

  const [currentParticipant, setCurrentParticipant] = useState<IUser | null>(
    null
  );

  const [messageContent, setMessageContent] = useState("");

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Scroll to the bottom of the chat when the component mounts or updates
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef.current, messages]);

  useEffect(() => {
    if (selectedConversation) {
      const participant = selectedConversation.participants.find(
        (p) => p.User.id !== user.id
      );
      if (participant) {
        setCurrentParticipant(participant.User);
      }

      const abortController = new AbortController();

      async function fetchMessages() {
        try {
          const { messages } = await getAllConversationMessages(
            selectedConversation!.id,
            abortController.signal
          );
          setMessages(messages);
          // Handle messages as needed, e.g., set them in state
        } catch (error) {
          console.error("Failed to fetch conversation messages:", error);
        }
      }

      fetchMessages();

      // Cleanup function to avoid memory leaks
      return () => {
        abortController.abort();
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchConversations = async () => {
      try {
        const { conversations } = await getAllConversations(
          abortController.signal
        );
        setConversations(conversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    fetchConversations();

    // Cleanup function to avoid memory leaks
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (user.id) {
      const socket = io(import.meta.env.VITE_BASE_WS_URL, {
        query: {
          id: user.id,
        },
      });

      setSocket(socket);

      //join
      socket.emit("join", { id: user.id });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        setSocket(null);
        socket.close();
      }
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const abortController = new AbortController();

      socket.on("receive_message", async () => {
        console.log("receive_message event triggered");

        const { conversations } = await getAllConversations(
          abortController.signal
        );
        setConversations(conversations);

        if (selectedConversation) {
          const { messages } = await getAllConversationMessages(
            selectedConversation.id,
            abortController.signal
          );
          setMessages(messages);
        }
      });

      return () => {
        socket.off("receive_message");
        abortController.abort();
      };
    }
  }, [socket, selectedConversation]);

  const handleSendMessage = useCallback(async () => {
    if (selectedConversation && messageContent.trim()) {
      try {
        await sendMessage(selectedConversation.id, messageContent);
        setMessageContent(""); // Clear the input after sending

        //fetch the latest messages after sending
        const { messages } = await getAllConversationMessages(
          selectedConversation.id
        );
        setMessages(messages);

        //send lastMessage of the conversation to update the lastMessage in the conversation list
        const updatedConversation = {
          ...selectedConversation,
          lastMessage: {
            message: messageContent,
          },
        };
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === updatedConversation.id ? updatedConversation : conv
          )
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }, [selectedConversation, messageContent]);

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
              {/* check lenght first then show user that not currently user */}
              {conversations.length > 0 ? (
                conversations.map((conversation) => {
                  const participant = conversation.participants.find(
                    (p) => p.User.id !== user.id
                  );
                  return (
                    <ConversationUser
                      key={conversation.id}
                      firstname={participant?.User.firstname || "Unknown"}
                      lastname={participant?.User.lastname || ""}
                      picture_url={participant?.User.picture_url || ""}
                      lastMessage={
                        conversation.lastMessage?.message || "No messages yet"
                      }
                      onClick={() => setSelectedConversation(conversation)}
                    />
                  );
                })
              ) : (
                <span className="text-gray-500">No conversations found</span>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full ">
            {selectedConversation && currentParticipant ? (
              <>
                {/* show not current user */}
                <div className="flex flex-row gap-2 border-b border-[#E5E5E5] p-4 items-center w-full">
                  <div className="avatar">
                    <div className="w-14 rounded-full">
                      <img
                        src={currentParticipant.picture_url}
                        alt={`${currentParticipant.firstname} ${currentParticipant.lastname}`}
                      />
                    </div>
                  </div>
                  <span className="archivo-700 text-lg">
                    {currentParticipant.firstname} {currentParticipant.lastname}
                  </span>
                </div>
                <div
                  ref={chatRef}
                  className="w-full h-full flex flex-col gap-4 p-5 overflow-y-auto"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat ${
                        message.sender_id === user.id
                          ? "chat-end"
                          : "chat-start"
                      }`}
                    >
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={message.User.picture_url}
                            alt={`${message.User.firstname} ${message.User.lastname}`}
                          />
                        </div>
                      </div>
                      <div className="chat-header">
                        {message.User.firstname} {message.User.lastname}
                      </div>
                      <div className="chat-bubble">{message.message}</div>
                      <div className="chat-footer opacity-50">
                        <time className="text-xs opacity-50">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row gap-2 p-2 items-center w-full border-t border-[#E5E5E5]">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="input flex-1 rounded-3xl"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                  >
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
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">
                  Select a conversation to start chatting
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
