import { useEffect } from "react"
import "./App.css"
import { useDispatch, useSelector } from "react-redux"                     // Redux
import { Route, Routes, useNavigate } from "react-router-dom"              // React Router

// Components
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import AddCourse from "./components/core/Dashboard/AddCourse"
import Cart from "./components/core/Dashboard/Cart"
import EditCourse from "./components/core/Dashboard/EditCourse"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Instructor from "./components/core/Dashboard/Instructor"
import MyCourses from "./components/core/Dashboard/MyCourses"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import About from "./pages/About"
import Catalog from "./pages/Catalog"
import Contact from "./pages/Contact"
import CourseDetails from "./pages/CourseDetails"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import ViewCourse from "./pages/ViewCourse"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"



function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {                                                    // it store data of user in localstroage and when we open browser then that user logined;                 
    if(localStorage.getItem("token")){
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
  }, [])

  

  return (

   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">

      <Navbar/>                                         {/* navbar is common in all pages */}
      <Routes>
        
          <Route path="/" element={<Home/>} />
          <Route path="catalog/:catalogName" element={<Catalog/>} />
          <Route path="courses/:courseId" element={<CourseDetails/>} />
          <Route path="signup" element = { <OpenRoute> <Signup /> </OpenRoute> } />
          <Route path="login" element = { <OpenRoute> <Login /> </OpenRoute> } />
          <Route path="forgot-password" element = { <OpenRoute> <ForgotPassword /> </OpenRoute> } />
          <Route path="verify-email" element = { <OpenRoute> <VerifyEmail /> </OpenRoute> } />
          <Route path="update-password/:id" element = { <OpenRoute> <UpdatePassword /> </OpenRoute> } />
          <Route path="about" element = { <OpenRoute> <About /> </OpenRoute> } />
          <Route path="/contact" element={<Contact />} />

          <Route element = {<PrivateRoute> <Dashboard /> </PrivateRoute>} >

              <Route path="dashboard/my-profile" element={ < MyProfile />} /> 
              <Route path="dashboard/Settings" element={<Settings />} /> 

                { user?.accountType === ACCOUNT_TYPE.STUDENT && (          
                                    <>
                                        <Route path="dashboard/cart" element={<Cart />} />
                                        <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                                    </>
                                )           
                  }

                { user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                                        <>
                                            <Route path="dashboard/instructor" element={<Instructor />} />
                                            <Route path="dashboard/add-course" element={<AddCourse />} />
                                            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                                            <Route path="dashboard/my-courses" element={<MyCourses />} />    
                                        </>
                                  )
                    }
          </Route>
          
          <Route element = { <PrivateRoute> <ViewCourse /> </PrivateRoute> }>
                { user?.accountType === ACCOUNT_TYPE.STUDENT && (
                                                <>
                                                  <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails />} /> 
                                                </>
                                  )
                  }
          </Route>

          <Route path="*" element={<Error />} />


      </Routes>

   </div>

)};

export default App;
