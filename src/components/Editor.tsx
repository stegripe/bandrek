import { useContext, useEffect, useState } from "react";
import { executeQuery } from "../utils/api/executeQuery";
import TableContext from "./TableContext";
import TabView from "./TabView";

export default function Editor() {
	const [qColumns, setQColumns] = useState<{ Field: string; Type: string; Key: string }[] | null>(null);
	const [columns, setColumns] = useState<{ Field: string; Type: string; Key: string }[] | null>(null);
	const [editingCell, setEditingCell] = useState({ rowIndex: null, columnName: null });
	const [qValues, setQValues] = useState<{ [K: string]: any }[] | null>(null);
	const [values, setValues] = useState<{ [K: string]: any }[] | null>(null);
	const [view, setView] = useState<"data" | "query">("data");
	const [query, setQuery] = useState<string>("");
	const [error, setError] = useState<string>("");
	const { selection } = useContext(TableContext);

	const handleDoubleClick = (rowIndex: any, columnName: any) => {
		setEditingCell({ rowIndex, columnName });
	};

	const handleBlur = (newValue: any, rowIndex: any, columnName: any) => {
		// console.log(`Save ${newValue} for row ${rowIndex}, column ${columnName}`);
		// Update value in database
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

		executeQuery(`show columns from ${selection.table} from ${selection.database}`, []).then(response => {
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selection]);

	if (view === "data") {
		return selection ? (
			columns ? (
				<div className="w-full h-full flex flex-col">
					<TabView setView={setView} />
					<table className="table-fixed border-collapse">
						<thead>
							<tr>
								{columns.map(col => (
									<th key={col.Field} className="border-b border-r border-black py-1 px-2">
										{col.Field} ({col.Type}) {col.Key === "PRI" ? "(PK)" : col.Key === "MUL" ? "(FK)" : ""}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{values &&
								values.map((row, rowIndex) => (
									<tr key={rowIndex}>
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
						</tbody>
					</table>
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
