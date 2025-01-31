import { ChevronUp } from "lucide-react"
import { createPortal } from "react-dom"

export const Goup = () => {
    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return(createPortal(<div onClick={handleClick} className="fixed w-10 border border-primary aspect-square sm:w-14 rounded-full cursor-pointer active:scale-90 hover:scale-105 bg-secondary flex justify-center items-center bottom-5 right-5 z-40" ><ChevronUp size={30} color='brown' /></div>, document.getElementById('root')))
}