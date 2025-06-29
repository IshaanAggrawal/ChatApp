import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../store/useChatSlice";
import { axiosInstance } from "../utils/axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";

function Messageinput() {
  const { selectedUser, messages } = useSelector((store) => store.chat);
  const { authUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSendMessage = async () => {
    if (!text && !image) return;

    try {
      const base64Image = image ? await toBase64(image) : null;

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        text,
        image: base64Image,
      });

      const newMessage = res.data;
      dispatch(setMessages([...messages, newMessage]));

      socket.emit("sendMessage", newMessage);

      setText("");
      setImage(null);
    } catch (err) {
      toast.error("Failed to send message");
      console.error("Failed to send message", err);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="flex items-center p-2 border-t">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-3 py-2 mr-2 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mr-2"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default Messageinput;
