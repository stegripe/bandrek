import { ReactNode } from "react";

export default function HoverHL({
	children,
}: {
	children: ReactNode;
}) {
	return <span className="hover:bg-white hover:bg-opacity-20">{children}</span>;
}
