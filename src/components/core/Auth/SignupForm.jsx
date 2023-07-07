import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"



function SignupForm() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { firstName, lastName, email, password, confirmPassword } = formData


  // Handle input fields, when some value changes
  function handleOnChange(e) {
    setFormData( (prevData) =>({ ...prevData , [e.target.name] : e.target.value })                        
)}

  // Handle Form Submission
  function handleOnSubmit(e){
    e.preventDefault();
    if(password !== confirmPassword) {toast.error("Passwords do not match");  return ; }
    const signupData = { ...formData , accountType};
    dispatch(setSignupData(signupData))                                    // Setting signup data to state To be used after otp verification
    dispatch(sendOtp(formData.email, navigate))                           // Send OTP to user for verification
    setFormData({firstName: "", lastName: "",  email: "",  password: "",  confirmPassword: "",})           // Reset
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }


  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]
 


  return (
    
    <div>

      {/* Tab */}
      <Tab tabData = {tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">

        <div className="flex gap-x-4">

          <label>   {/* First Name */}
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"> First Name <sup className="text-pink-200">*</sup> </p>
              <input required type="text"  value = {firstName} onChange={handleOnChange} placeholder="Enter First Name" name="firstName"  style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", }}  className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]' />          
          </label>

          <label>    {/* Last Name */}
              <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'> Last Name <sup className='text-pink-200'>*</sup></p>
              <input required type="text"  value = {lastName} onChange={handleOnChange} placeholder="Enter Last Name" name="lastName" style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", }} className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]' />
          </label>         
          
        </div>


        <label className='w-full'>      {/* Email */}
             <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Email Address<sup className='text-pink-200'>*</sup></p>
             <input required type="email"  value = {email} onChange={handleOnChange} placeholder="Enter Email Name" name="email" style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", }} className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]' />
        </label>


        <div className="flex gap-x-4">                          {/* createPassword and Confirm Password */}

            <label className='relative'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Create Password<sup className='text-pink-200'>*</sup></p>
                <input  required  type = {showPassword ? ("text") : ("password")}  name="password"  onChange={handleOnChange}  value={password}  placeholder="Enter Password" style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", }}  className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]' />
            
                <span  className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
                </span>
            </label>

            <label className='relative'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Confirm Password<sup className='text-pink-200'>*</sup></p>
                <input  required  type = {showConfirmPassword ? ("text") : ("password")}  name="confirmPassword"  onChange={handleOnChange}  value={confirmPassword}  placeholder="Confirm Password" style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", }} className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]' />
            
                <span  className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
                </span>
            </label>

        </div>

        <button  type="submit"  className = "mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">  Create Account </button>


      </form>
      
    </div>
  

)}



export default SignupForm