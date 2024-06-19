import { FaSave } from "react-icons/fa";
import { executeQuery } from "../utils/api/executeQuery";
import ModalsEditor from "./Modals/ModalsEditor";
import TableContext from "./TableContext";
import TabView from "./TabView";

import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { FaKey, FaXmark } from "react-icons/fa6";

export default function Editor({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) {
	const [qColumns, setQColumns] = useState<{ Field: string; Type: string; Key: string }[] | null>(null);
	const [columns, setColumns] = useState<{ Field: string; Type: string; Key: string }[] | null>(null);
	const [editingCell, setEditingCell] = useState({ rowIndex: null, columnName: null });
	const [qValues, setQValues] = useState<{ [K: string]: any }[] | null>(null);
	const [values, setValues] = useState<{ [K: string]: any }[] | null>(null);
	const [newData, setNewData] = useState<{ [K: string]: any } | null>(null);
	const [newDataView, setNewDataView] = useState<boolean>(false);
	const [deleteView, setDeleteView] = useState<boolean>(false);
	const [view, setView] = useState<"data" | "query">("data");
	const [query, setQuery] = useState<string>("");
	const [error, setError] = useState<string>("");
	const { selection } = useContext(TableContext);

	const [contextMenu, setContextMenu] = useState<{
		mouseX: number;
		mouseY: number;
		visible: string;
		rowIndex?: number;
	}>({
		mouseX: 0,
		visible: "",
		mouseY: 0
	});

	const handleRightClick = useCallback((event: React.MouseEvent, visible: string, rowIndex?: number) => {
		event.preventDefault();
		setContextMenu({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
			visible,
			rowIndex
		});
	}, []);

	const handleClickOutside = useCallback(() => {
		setContextMenu(prevState => ({ ...prevState, visible: "", rowIndex: undefined }));
	}, []);

	const handleDoubleClick = (rowIndex: any, columnName: any) => {
		setEditingCell({ rowIndex, columnName });
	};

	const handleBlur = (newValue: any, rowIndex: any, columnName: any) => {
		executeQuery(`update ${selection?.database}.${selection?.table} set ${columnName} = ? where ${columns![0].Field} = ?`, [
			newValue,
			values![rowIndex][columns![0].Field]
		]).then(response => {
			if ("data" in response) {
				executeQuery(`select * from ${selection?.database}.${selection?.table}`, []).then(response => {
					if ("data" in response) {
						setValues(response.data[0]);
						setError("");
					} else if ("message" in response) {
						setError(response.message);
					}
				});
			} else if ("message" in response) {
				setError(response.message);
			}
		});
		setEditingCell({ rowIndex: null, columnName: null });
	};

	useEffect(() => {
		if (!selection) return;

		columns && setColumns(null);
		values && setValues(null);

		executeQuery(`show columns from ${selection.database}.${selection.table}`, []).then(response => {
			if ("data" in response) {
				const data: { Field: string; Type: string; Key: string }[] = response.data[0];
				setColumns(data);

				executeQuery(`select * from ${selection.database}.${selection.table}`, []).then(response => {
					if ("data" in response) {
						setValues(response.data[0]);
					}
				});
			}
		});

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selection, handleClickOutside]);

	if (view === "data") {
		return selection ? (
			columns ? (
				<div className="w-full h-full flex flex-col">
					<TabView setView={setView} setNewDataView={setNewDataView} />
					<div className="w-full h-full overflow-auto" onContextMenu={e => handleRightClick(e, "new")}>
						<table className="table-fixed border-collapse">
							<thead>
								<tr>
									{newDataView && <th className="border-b border-r border-black py-1 px-2">Action</th>}
									{columns.map(col => (
										<th key={col.Field} className="border-b border-r border-black py-1 px-2">
											{col.Field} ({col.Type}){" "}
											{col.Key === "PRI" ? (
												<FaKey className="text-yellow-500" title="Primary Key" />
											) : col.Key === "MUL" ? (
												<FaKey className="text-white" title="Foreign Key" />
											) : (
												""
											)}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{values &&
									values.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											onContextMenu={e => {
												e.stopPropagation();
												// handleRightClick(e, "del", rowIndex);
											}}
											className="hover:bg-black hover:bg-opacity-10">
											{columns.map(col => (
												<td
													key={col.Field}
													className="border-b border-r border-black py-1 px-2"
													onDoubleClick={() => handleDoubleClick(rowIndex, col.Field)}>
													{editingCell.rowIndex === rowIndex && editingCell.columnName === col.Field ? (
														<input
															className="text-black"
															type="text"
															defaultValue={row[col.Field] ?? "NULL"}
															onBlur={e => handleBlur(e.target.value, rowIndex, col.Field)}
															autoFocus
														/>
													) : (
														row[col.Field] ?? "NULL"
													)}
												</td>
											))}
										</tr>
									))}
								{/* Add New Data */}
								{newDataView && (
									<tr>
										<td className="border-b border-t border-r border-black">
											<button
												onClick={() => {
													executeQuery(
														`insert into ${selection.database}.${selection.table} (${Object.keys(
															newData as any
														).join(", ")}) values (${Object.keys(newData as any)
															.map(() => "?")
															.join(", ")})`,
														Object.values(newData as any)
													).then(response => {
														if ("data" in response) {
															executeQuery(
																`select * from ${selection.database}.${selection.table}`,
																[]
															).then(response => {
																if ("data" in response) {
																	setValues(response.data[0]);
																	setError("");
																} else if ("message" in response) {
																	setError(response.message);
																}
															});
														} else if ("message" in response) {
															setError(response.message);
														}
													});
												}}
												className="bg-blue-700 hover:bg-blue-800 text-white font-bold p-2">
												<FaSave />
											</button>
											<button
												onClick={() => setNewDataView(false)}
												className=" bg-red-700 hover:bg-red-800 text-white font-bold p-2">
												<FaXmark />
											</button>
										</td>
										{columns.map(col => (
											<td key={col.Field} className="border-b border-r border-black py-1 px-2">
												<input
													className="text-black"
													type="text"
													placeholder={col.Field}
													onChange={e => setNewData({ ...newData, [col.Field]: e.target.value })}
												/>
											</td>
										))}
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<ModalsEditor
						setNewDataView={setNewDataView}
						database={selection.database}
						contextMenu={contextMenu}
						setLoading={setLoading}
						table={selection.table}
					/>
				</div>
			) : (
				<>
					<TabView setView={setView} />
					<div className="w-full h-full flex flex-col justify-center items-center">
						<p className="text-2xl font-bold">Database: {selection.database}</p>
						<p className="text-2xl font-bold">Table: {selection.table}</p>
					</div>
				</>
			)
		) : (
			<>
				<TabView setView={setView} />
				<div className="w-full h-full flex flex-col justify-center items-center">
					<p className="text-2xl font-bold">No table selected</p>
				</div>
			</>
		);
	} else if (view === "query") {
		return (
			<div className="w-full h-full flex flex-col">
				<TabView setView={setView} />
				<textarea
					value={query}
					onChange={e => setQuery(e.target.value)}
					className="w-full h-full p-2 text-black"
					placeholder="Enter your query here"
				/>
				<button
					onClick={() => {
						const queries = query.replaceAll("\n", "").split(";");

						queries.forEach(q => {
							executeQuery(q, []).then(response => {
								if ("data" in response) {
									const firstItem = response.data[0];
									if (firstItem.length > 0) {
										setQValues(firstItem);
									}
									setError("");
								} else if ("message" in response) {
									if (response.message.includes("No database selected")) {
										return setError("No database selected, please use select * from database.table;");
									}

									setError(response.message);
									setQValues(null);
								} else {
									setError("");
									setQValues(null);
								}
							});
						});
					}}
					className="w-full h-8 bg-black text-white font-bold">
					Run Query
				</button>
				{qValues && (
					<div className="w-full h-full overflow-auto">
						<table className="table-fixed border-collapse">
							<thead>
								<tr>
									{qValues.length > 0 &&
										Object.keys(qValues[0]).map(key => (
											<th key={key} className="border-b border-r border-black py-1 px-2">
												{key}
											</th>
										))}
								</tr>
							</thead>
							<tbody>
								{qValues.map((row, rowIndex) => (
									<tr key={rowIndex}>
										{Object.values(row).map((value, valueIndex) => {
											// Check if value is an object and render it accordingly
											if (typeof value === "object" && value !== null) {
												return (
													<td
														key={`${rowIndex}-${valueIndex}`}
														className="border-b border-r border-black py-1 px-2">
														{value.type + ": " + value.data}{" "}
														{/* Example of how to render object values */}
													</td>
												);
											} else {
												// Render non-object values as before
												return (
													<td
														key={`${rowIndex}-${valueIndex}`}
														className="border-b border-r border-black py-1 px-2">
														{value ?? "NULL"}
													</td>
												);
											}
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{/* Show if error */}
				{error && (
					<div className="w-full h-fit bg-red-500 text-white font-bold">
						<p>{error}</p>
					</div>
				)}
			</div>
		);
	}
}
