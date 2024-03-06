import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { ReactNode, useState } from "react";

export default function Dropdown({ head, items }: { head: ReactNode; items: ReactNode[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <div onClick={() => setOpen(!open)} className="flex items-center cursor-pointer gap-2">
                {open ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                {head}
            </div>
            {open && (
                <div className="flex flex-col">
                    {items.map(x => (
                        <div className="border-l border-black ml-2 pl-2 hover:bg-white hover:bg-opacity-20">{x}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
