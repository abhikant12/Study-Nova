import React from "react";
// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";


const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (

    <div className = {`w-[360px] lg:w-[30%] text-richblack-25 h-[300px] box-border cursor-pointer
                   ${currentCard === cardData.heading ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50" : "bg-richblack-800"}  `}
                    onClick = {() => setCurrentCard(cardData.heading)} >
         
        <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
          <div className = {` ${currentCard === cardData.heading && "text-richblack-800"} font-semibold text-[20px]`} > {cardData?.heading} </div>
          <div className="text-richblack-400">{cardData.description}</div>
        </div>

        <div className = {`flex justify-between ${currentCard === cardData.heading ? "text-blue-300" : "text-richblack-300" } px-6 py-3 font-medium`} >  
          <p className="flex items-center gap-2 text-[16px]">  <HiUsers /> {cardData.level} </p>           {/* Level :- Beginner*/}
          <p className="flex items-center gap-2 text-[16px]"> <ImTree /> {cardData.lessionNumber} Lession </p>       {/* Flow Chart :- 6 Lession*/}
        </div>

    </div>
  
 )}

export default CourseCard;