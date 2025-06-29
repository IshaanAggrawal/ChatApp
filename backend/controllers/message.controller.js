    const User = require("../models/User.model");
    const Message = require("../models/message.model");
    const cloudinary = require('../utils/cloudinary');

    const getUsers = async (req, res) => {
    try {
        const currentuserid = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: currentuserid } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    };

    const getmessages = async (req, res) => {
    try {
        const { id: otherid } = req.params;
        const currentId = req.user._id;
        const messages = await Message.find({
        $or: [
            { senderId: currentId, receiverId: otherid },
            { senderId: otherid, receiverId: currentId },
        ]
        }).sort({ createdAt: 1 }); // ✅ sorted by time
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    };

    const sendmessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: otherId } = req.params;
        const currentId = req.user._id;

        let imageUrl;
        if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
        senderId: currentId,
        receiverId: otherId,
        text,
        image: imageUrl
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    };

    module.exports = { getUsers, getmessages, sendmessage };
