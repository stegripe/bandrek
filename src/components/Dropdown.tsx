import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { ReactNode, useState } from "react";
import HoverHL from "./HoverHL";

export default function Dropdown({ head, children, onOpen, onClose }: { head: ReactNode; children: ReactNode; onOpen?: () => void; onClose?: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <HoverHL>
                <button onClick={() => {
                    setOpen(!open);
                    (open ? onClose : onOpen)?.();
                }} className="flex items-center cursor-pointer gap-2 w-full h-full">
                    {open ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                    {head}
                </button>
            </HoverHL>
            {open && (
                <div className="border-l border-black ml-2 pl-2 flex flex-col">
                    {children}
                </div>
            )}
        </div>
    )
}
