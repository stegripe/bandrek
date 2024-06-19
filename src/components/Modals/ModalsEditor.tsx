import { executeQuery } from "../../utils/api/executeQuery";

import { Dispatch, SetStateAction } from "react";

export default function ModalsEditor({
	setNewDataView,
	contextMenu,
	setLoading,
	database,
	table
}: {
	contextMenu: { mouseX: number; mouseY: number; visible: string; rowIndex?: number };
	setNewDataView: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	database: string;
	table: string;
}) {
	if (contextMenu.visible === "del") {
		return (
			<ul
				className="absolute text-white border rounded bg-neutral-700"
				style={{
					top: `${contextMenu.mouseY}px`,
					left: `${contextMenu.mouseX}px`
				}}>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setLoading(true);
						executeQuery(`delete from ${database}.${table} where ${table} = ?`, [contextMenu.rowIndex]).then(
							response => {
								if ("data" in response) {
									setLoading(false);
								}
								setLoading(false);
							}
						);
					}}>
					Delete Data
				</li>
			</ul>
		);
	} else if (contextMenu.visible === "new") {
		return (
			<ul
				className="absolute text-white border rounded bg-neutral-700"
				style={{
					top: `${contextMenu.mouseY}px`,
					left: `${contextMenu.mouseX}px`
				}}>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setNewDataView(true);
					}}>
					Insert Data
				</li>
			</ul>
		);
	} else {
		return <></>;
	}
}
