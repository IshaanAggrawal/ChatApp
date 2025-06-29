import { Link, useNavigate } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { setAuthUser } from "../store/authSlice";

    const Navbar = () => {
    // const { logout, authUser } = useAuthStore();
    const {authUser}=useSelector((store)=>store.auth)
    const dispatch =useDispatch()
    const navigate=useNavigate()

    const logouthandler=async (e)=>{
        e.preventDefault();
            try {
            const res = await axiosInstance.get("/auth/logout");
            if (res.data.success) {
            toast.success("Logout successfully!");
            navigate("/signup");
            dispatch(setAuthUser(null))
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
        backdrop-blur-lg bg-base-100/80"
        >
        <div className="container mx-auto px-4 h-16">
            <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">ChatterBox</h1>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <Link
                to={"/settings"}
                className={`
                btn btn-sm gap-2 transition-colors
                
                `}
                >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
                </Link>

                {authUser && (
                <>
                    <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                    </Link>

                    <button className="flex gap-2 items-center" onClick={logouthandler}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                    </button>
                </>
                )}
            </div>
            </div>
        </div>
        </header>
    );
    };
    export default Navbar;