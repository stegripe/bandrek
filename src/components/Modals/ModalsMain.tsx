import { executeQuery } from "../../utils/api/executeQuery";
import CreateDatabaseModal from "./CreateDatabase";
import CreateTableModal from "./CreateTable";
import AddColumnModal from "./AddColumn";
import { Dispatch, SetStateAction, useState } from "react";

export default function ModalsMain({
	contextMenu,
	setDatabases,
	setLoading,
	collations,
	setTables,
	loading,
	tables
}: {
	contextMenu: { mouseX: number; mouseY: number; visible: string; database?: string; table?: string };
	setDatabases: Dispatch<SetStateAction<{ Database: string }[] | null>>;
	setTables: Dispatch<SetStateAction<{ [K: string]: string }[] | null>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	tables: { [K: string]: string }[] | null;
	collations: string[] | null;
	loading: boolean;
}) {
	const [error, setError] = useState<string | null>(null);
	const [openCDModal, setOpenCDModal] = useState(false);
	const [openCTModal, setOpenCTModal] = useState(false);
	const [openACModal, setOpenACModal] = useState(false);

	if (contextMenu.visible === "main") {
		return (
			<ul
				className="absolute text-white border rounded bg-neutral-700"
				style={{
					top: `${contextMenu.mouseY}px`,
					left: `${contextMenu.mouseX}px`
				}}>
				<li className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded" onClick={() => setOpenCDModal(true)}>
					Create Database
				</li>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setLoading(true);
						executeQuery("show databases", []).then(response => {
							setDatabases("data" in response ? response.data[0] : null);
							setLoading(false);
						});
					}}>
					Refresh Database List
				</li>
			</ul>
		);
	} else if (contextMenu.visible === "database") {
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
						setOpenCTModal(true);
					}}>
					Create Table
				</li>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setLoading(true);
						executeQuery(`drop database ${contextMenu.database}`, []).then(response => {
							executeQuery("show databases", []).then(response => {
								setDatabases("data" in response ? response.data[0] : null);
								setLoading(false);
							});
						});
					}}>
					Drop Database
				</li>
			</ul>
		);
	} else if (contextMenu.visible === "table") {
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
						setOpenACModal(true);
					}}>
					Add New Column
				</li>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setLoading(true);
						executeQuery(`drop table ${contextMenu.database}.${contextMenu.table}`, []).then(response => {
							executeQuery(`show tables from ${contextMenu.database}`, []).then(response => {
								setTables("data" in response ? response.data[0] : null);
								setLoading(false);
							});
						});
					}}>
					Drop Table
				</li>
			</ul>
		);
	} else if (openCDModal) {
		return (
			<CreateDatabaseModal
				setOpenCDModal={setOpenCDModal}
				setDatabases={setDatabases}
				openCDModal={openCDModal}
				collations={collations}
				setLoading={setLoading}
				setError={setError}
			/>
		);
	} else if (openCTModal) {
		return (
			<CreateTableModal
				database={contextMenu.database || ""}
				setOpenCTModal={setOpenCTModal}
				setLoading={setLoading}
				setTables={setTables}
				setError={setError}
			/>
		);
	} else if (openACModal) {
		return (
			<AddColumnModal
				database={contextMenu.database || ""}
				table={contextMenu.table || ""}
				setOpenACModal={setOpenACModal}
				setLoading={setLoading}
				setTables={setTables}
				setError={setError}
			/>
		)
	} else if (error) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
				<div className="bg-red-700 p-4 rounded-lg">
					<p>{error}</p>
					<button
						className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={() => setError(null)}>
						Close
					</button>
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}
