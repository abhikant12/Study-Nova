import IconBtn from "./IconBtn"


export default function ConfirmationModal({ modalData }) {
  return (

    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        
        <p className="text-2xl font-semibold text-richblack-5"> {modalData?.text1} </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">  {modalData?.text2} </p>
      
        <div className="flex items-center gap-x-4">
          <IconBtn onclick = {modalData?.btn1Handler} text = {modalData?.btn1Text} />
          <button className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900" onClick={modalData?.btn2Handler} >
            {modalData?.btn2Text}
          </button>
        </div>

      </div>
    </div>
  )
}


/*
it is modal like when we click on logout in dashboard profile then all background screen become blure and a alreat appear that "are
you sure to logout" and blew two option "yes" or "No" , if we click on yes then logout happend and click on No then model get cancal out;
*/


