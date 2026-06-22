import { useState,useEffect } from "react"




export default function Timer(){
    const [timer,setTimer] = useState("0:00");

    return(
    <div className="flex flex-col items-center justify-center gap-1 w-27.5 h-27.5 rounded-[14px] bg-[#161616] border border-[#2e2e2e]">
        <span className="text-[30px] font-bold text-[#e0e0e0] tracking-[0.02em] leading-none">
            {timer}
        </span>
      <span className="text-[9px] font-medium tracking-[0.20em] uppercase text-[#3d3d3d]">
        sec
      </span>
    </div>
    )
}