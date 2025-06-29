import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsMessagesLoading, setMessages } from "../store/useChatSlice";
import Chatheader from './Chatheader';
import Messageinput from "./Messageinput";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { axiosInstance } from "../utils/axios";

const formatMessageTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading } = useSelector(
    (store) => store.chat
  );
  const { authUser, socket } = useSelector((store) => store.auth);

  const messageEndRef = useRef(null);
  const messagesRef = useRef(messages);
  const dispatch = useDispatch();

  // Keep messagesRef updated
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Fetch messages on user selection
  useEffect(() => {
    const getMessages = async (userId) => {
      dispatch(setIsMessagesLoading(true));
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        dispatch(setMessages(res.data));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load messages");
      } finally {
        dispatch(setIsMessagesLoading(false));
      }
    };

    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // Auto scroll to latest
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Listen for real-time message
  useEffect(() => {
    const handleIncomingMessage = (newMessage) => {
      const isRelevant =
        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser?._id);

      if (isRelevant) {
        dispatch(setMessages([...messagesRef.current, newMessage]));
      }
    };

    socket?.on("receiveMessage", handleIncomingMessage);
    return () => {
      socket?.off("receiveMessage", handleIncomingMessage);
    };
  }, [selectedUser?._id, authUser?._id, socket]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Chatheader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === authUser._id;
          const isLastMessage = index === messages.length - 1;

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              ref={isLastMessage ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <Messageinput />
    </div>
  );
};

export default ChatContainer;
