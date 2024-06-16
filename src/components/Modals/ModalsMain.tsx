import { executeQuery } from "../../utils/api/executeQuery";

import CreateDatabaseModal from "./CreateDatabase";
import CreateTableModal from "./CreateTable";

import { Dispatch, SetStateAction } from "react";

export default function ModalsMain({
	contextMenuMain,
	setOpenCDModal,
	setOpenCTModal,
	setDatabases,
	openCDModal,
	openCTModal,
	setLoading,
	collations,
	setError,
	loading,
	error
}: {
	setDatabases: Dispatch<SetStateAction<{ Database: string }[] | null>>;
	contextMenuMain: { mouseX: number; mouseY: number; visible: string; database?: string };
	setError: Dispatch<SetStateAction<string | null>>;
	setOpenCDModal: Dispatch<SetStateAction<boolean>>;
	setOpenCTModal: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	collations: string[] | null;
	openCDModal: boolean;
	openCTModal: boolean;
	error: string | null;
	loading: boolean;
}) {
	if (contextMenuMain.visible === "main") {
		return (
			<ul
				className="absolute text-white border rounded bg-neutral-700"
				style={{
					top: `${contextMenuMain.mouseY}px`,
					left: `${contextMenuMain.mouseX}px`
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
					Refresh Databases
				</li>
			</ul>
		);
	} else if (contextMenuMain.visible === "database") {
		return (
			<ul
				className="absolute text-white border rounded bg-neutral-700"
				style={{
					top: `${contextMenuMain.mouseY}px`,
					left: `${contextMenuMain.mouseX}px`
				}}>
				<li className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded" onClick={() => setOpenCTModal(true)}>
					Create Table
				</li>
				<li
					className="hover:cursor-pointer px-2 py-1 hover:bg-neutral-800 rounded"
					onClick={() => {
						setLoading(true);
						executeQuery(`drop database ${contextMenuMain.database}`, []).then(response => {
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
				setOpenCTModal={setOpenCTModal}
				setDatabases={setDatabases}
				openCTModal={openCTModal}
				collations={collations}
				setLoading={setLoading}
				setError={setError}
			/>
		);
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
