import { Eye, EyeOff, Loader2, Mail, MessageSquare, User, Lock } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios';
import toast from "react-hot-toast";
import { setAuthUser, setIsSigningUp } from '../store/authSlice';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSigningUp } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const submitHandler = async (e) => {
  e.preventDefault();
  try {
    dispatch(setIsSigningUp(true));
    const res = await axiosInstance.post("/auth/register", formData);
      if (res.data.success) {
        dispatch(setAuthUser(res.data));
        toast.success("Registered successfully!");
        navigate("/");
      }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    dispatch(setIsSigningUp(false));
  }
};

  return (
    <>
      <div className="min-h-screen mx-44 my-5">
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
              </div>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    name="fullname"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={changeEventHandler}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={changeEventHandler}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10`}
                    name='password'
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={changeEventHandler}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
