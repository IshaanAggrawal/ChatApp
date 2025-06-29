import { useState } from "react";
import { Camera, Info, Mail, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsUpdatingProfile } from "../store/authSlice";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile } = useSelector((store) => store.auth);
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullname, setFullname] = useState(authUser.fullname);
  const [description, setDescription] = useState(authUser.description || "");
  const dispatch = useDispatch();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be under 2MB.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      try {
        dispatch(setIsUpdatingProfile(true));
        const res = await axiosInstance.put("/auth/update-profile", {
          profilePic: base64Image,
        });

        if (res.data.success) {
          dispatch(setAuthUser(res.data.user));
          toast.success("Profile picture updated!");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        dispatch(setIsUpdatingProfile(false));
      }
    };
  };

  const handleSave = async () => {
    try {
      dispatch(setIsUpdatingProfile(true));
      const res = await axiosInstance.put("/auth/update-profile", {
        fullname,
        description,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success("Profile updated!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      dispatch(setIsUpdatingProfile(false));
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Update your profile info</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/image.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click camera icon to update photo"}
            </p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input
                type="text"
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={isUpdatingProfile}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Description
              </div>
              <textarea
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                placeholder="Add a short description about yourself"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUpdatingProfile}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isUpdatingProfile}
              className="btn btn-primary w-full mt-4"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Account Info */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
