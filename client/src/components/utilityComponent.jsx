import { Link, Trash } from "lucide-react"

export const Input = ({ placeholder, size = "large", limitSize = true, ...props }) => {
    return (
        <input
            type="text"
            {...props}
            placeholder={placeholder}
            name={placeholder}
            aria-label={placeholder}
            className={`px-2 py-1 mt-2 rounded ${limitSize && "max-w-52"} ${size !== "large" && "max-w-48"}`}
        />
    )
}

export const Button = ({ handleClick, placeholder, ...props }) => {
    return (
        <button
            {...props}
            onClick={handleClick}
            className="px-4 py-1 bg-green-400 w-fit rounded-md hover:bg-green-500 active:scale-95 hover:scale-105 ease-linear duration-75 cursor-pointer"
            aria-label={placeholder}
        >
            {placeholder}
        </button>
    )
}

export const Tab = ({ handleClick, goto, val, tab }) => {
    return (
        <div
            onClick={() => handleClick(goto)}
            className={`border text-sm ${tab === goto ? "bg-primary" : "bg-dark text-desc"} cursor-pointer flex-1 px-2 py-1`}
            aria-selected={tab === goto}
        >
            {val}
        </div>
    )
}

export const Tags = ({ tag, setTagsList }) => {
    return (
        <div className="relative w-fit rounded flex justify-center items-center bg-desc">
            <span className="text-dark px-2 py-1 cursor-pointer">{tag}</span>
            <div
                onClick={() => {
                    setTagsList((prev) => prev.filter((p) => p !== tag))
                }}
                aria-label={`Remove tag ${tag}`}
                className="absolute top-0 right-0 p-1 cursor-pointer"
            >
                <Trash color="red" size={15} />
            </div>
        </div>
    )
}

export const LinkTag = ({ linkNum, link, setImageLinks }) => {
    return (
        <div className="flex flex-col text-desc">
            <div className="flex gap-2 justify-between">
                <Link color="yellow" size={15} />
                <div
                    onClick={() => setImageLinks((prev) => prev.filter((p) => p !== link))}
                    aria-label={`Remove link ${linkNum}`}
                    className="hover:scale-110 cursor-pointer active:scale-90"
                >
                    <Trash color="red" size={15} />
                </div>
            </div>
            <p className="text-[0.75rem]">link {linkNum}</p>
        </div>
    )
}
