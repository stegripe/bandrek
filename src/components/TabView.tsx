import { Dispatch, SetStateAction } from "react";

export default function TabView({
	setView,
	setNewDataView
}: {
	setView: Dispatch<SetStateAction<"data" | "query">>;
	setNewDataView?: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className="flex h-8 border-b border-black">
			<button
				className="text-white font-bold h-full w-auto px-1 hover:bg-white hover:bg-opacity-20 border-r border-black"
				onClick={() => setView("data")}>
				View Data
			</button>
			<button
				className="text-white font-bold h-full w-auto px-1 hover:bg-white hover:bg-opacity-20 border-r border-black"
				onClick={() => setView("query")}>
				Query
			</button>
		</div>
	);
}
