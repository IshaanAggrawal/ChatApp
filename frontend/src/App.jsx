import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './shared/Navbar'
import Signup from './auth/Signup'
import Login from './auth/Login'
import Home from './components/Home'
import Setting from './components/Setting'
import Profile from './components/Profile'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsCheckingAuth, setAuthUser, setSocket } from './store/authSlice'
import { axiosInstance } from './utils/axios'
import{Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import socket from './utils/socket';



function App() {
  const { isCheckingAuth, authUser } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setIsCheckingAuth(true));
      try {
        const res = await axiosInstance.get("/auth/check");
        console.log("CHECK AUTH RESPONSE:", res.data);
        dispatch(setAuthUser(res.data));
      } catch (error) {
        dispatch(setAuthUser(null));
        console.log("Error in auth check:", error);
      } finally {
        dispatch(setIsCheckingAuth(false));
      }
    };
    checkAuth();
  }, [dispatch]);

    useEffect(() => {
    dispatch(setSocket(socket));
  }, []);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
    <Toaster position="bottom-right" />
    <Navbar/>
      <Routes>
        <Route path='/' element={authUser? <Home/>:<Navigate to='/login'/>} />
        <Route path='/signup' element={!authUser? <Signup />:<Navigate to='/'/>} />
        <Route path='/login' element={!authUser? <Login />:<Navigate to='/'/>} />
        <Route path='/settings' element={<Setting />} />
        <Route path='/profile' element={authUser? <Profile />:<Navigate to='/login'/>} />
      </Routes>
    </>
  )
}

export default App
