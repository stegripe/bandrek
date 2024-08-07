import { executeQuery } from "../utils/api/executeQuery";
import ModalsMain from "../components/Modals/ModalsMain";
import TableDropdown from "../components/TableDropdown";
import TableContext from "../components/TableContext";
import Editor from "../components/Editor";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function Index() {
	const [selection, setSelection] = useState<{ database: string; table: string } | null>(null);
	const [databases, setDatabases] = useState<{ Database: string }[] | null>(null);
	const [tables, setTables] = useState<{ [K: string]: string }[] | null>(null);
	const [collations, setCollations] = useState<string[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
		visible: string;
		database?: string;
		table?: string;
	}>({
		mouseX: 0,
		mouseY: 0,
		visible: ""
	});

	const handleRightClick = useCallback((event: React.MouseEvent, type: string, database?: string, table?: string) => {
		event.preventDefault();
		setContextMenu({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
			visible: type,
			database,
			table
		});
	}, []);

	const handleClickOutside = useCallback(() => {
		setContextMenu(prevState => ({ ...prevState, visible: "" }));
	}, []);

	useEffect(() => {
		setLoading(true);
		executeQuery("show databases", []).then(response => {
			setDatabases("data" in response ? response.data[0] : null);
			executeQuery(`show collation`, []).then(response => {
				setCollations(
					"data" in response ? response.data[1].map((c: { collation: CollationType }) => c.collation.name) : []
				);
				setLoading(false);
			});
		});
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<div className="w-full h-full max-h-full text-white flex flex-col">
			<p className="w-full text-center text-xl font-bold py-2 border-b border-black">Bandrek</p>
			<TableContext.Provider value={{ selection, setSelection }}>
				<div className="w-full h-full flex">
					<div
						id="main"
						className="w-96 max-h-full overflow-auto border-r border-black"
						onContextMenu={e => handleRightClick(e, "main")}>
						{databases &&
							databases.map(({ Database: Database }) => (
								<div
									id="database"
									key={Database}
									onContextMenu={e => {
										e.stopPropagation(); // Stop event from propagating to the parent
										handleRightClick(e, "database", Database);
									}}>
									<TableDropdown
										handleRightClick={handleRightClick}
										setTables={setTables}
										head={Database}
										tables={tables}
									/>
								</div>
							))}
					</div>
					<div className="w-full h-full overflow-auto">
						<Editor setLoading={setLoading} />
					</div>
				</div>
			</TableContext.Provider>
			<ModalsMain
				setDatabases={setDatabases}
				contextMenu={contextMenu}
				setLoading={setLoading}
				collations={collations}
				setTables={setTables}
				loading={loading}
				tables={tables}
			/>
			{loading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<Image src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" alt="Loading" width={50} height={50} />
				</div>
			)}
		</div>
	);
}
