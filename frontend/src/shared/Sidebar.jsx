    import { Users } from "lucide-react";
    import { useEffect, useState } from "react";
    import { useDispatch, useSelector } from 'react-redux';
    import { axiosInstance } from '../utils/axios';
    import {setIsUsersLoading,setUsers,setSelectedUser} from "../store/useChatSlice";
    import toast from "react-hot-toast";
    import SidebarSkeleton from "../skeletons/SidebarSkeleton";

    function Sidebar() {
    const dispatch = useDispatch();

    const { users, selectedUser, isUsersLoading } = useSelector((store) => store.chat);
    const { onlineUsers, authUser } = useSelector((store) => store.auth);

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
        dispatch(setIsUsersLoading(true));
        try {
            const res = await axiosInstance.get("/messages/users");
            dispatch(setUsers(res.data));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load users.");
        } finally {
            dispatch(setIsUsersLoading(false));
        }
        };
        getUsers();
    }, [dispatch]);

    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user._id))
        : users;

    const onlineCount = onlineUsers.filter((id) => id !== authUser?._id).length;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
            </div>

            <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
                <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineCount} online)</span>
            </div>
        </div>

        <div className="overflow-y-auto w-full py-3">
            {filteredUsers.map((user) => (
            <button
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
            >
                <div className="relative mx-auto lg:mx-0">
                <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
                </div>

                <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
                </div>
            </button>
            ))}

            {filteredUsers.length === 0 && ( //if after filter there is no one ie length is 0 then we will show no user online
            <div className="text-center text-zinc-500 py-4">No online users</div>
            )}
        </div>
        </aside>
    );
    }

    export default Sidebar;
