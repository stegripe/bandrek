import { executeQuery } from "../../utils/api/executeQuery";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { dataOptions, dataTypes } from "../../utils/database";

export default function AddColumnModal({
	setOpenACModal,
	setLoading,
	setTables,
	database,
	setError,
	table
}: {
	setTables: Dispatch<SetStateAction<{ [K: string]: string }[] | null>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setOpenACModal: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	database: string | null;
	table: string;
}) {
	const [newTableData, setNewTableData] = useState<TableDataType[]>([{ name: "", type: "", length: "" }]);

	const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const list: TableDataType[] = [...newTableData];

		switch (name) {
			case "name":
				list[index].name = value;
				setNewTableData(list);
				break;
			case "length":
				list[index].length = value;
				setNewTableData(list);
				break;
			case "isUnsigned":
				list[index].isUnsigned = !list[index].isUnsigned;
				setNewTableData(list);
				break;
			case "isAutoIncrement":
				list[index].isAutoIncrement = !list[index].isAutoIncrement;
				setNewTableData(list);
				break;
			case "isPrimaryKey":
				list[index].isPrimaryKey = !list[index].isPrimaryKey;
				setNewTableData(list);
				break;
			case "isUnique":
				list[index].isUnique = !list[index].isUnique;
				setNewTableData(list);
				break;
			case "isNotNull":
				list[index].isNotNull = !list[index].isNotNull;
				setNewTableData(list);
				break;
			case "isZerofill":
				list[index].isZerofill = !list[index].isZerofill;
				setNewTableData(list);
				break;
			default:
				break;
		}
	};

	const handleSelectChange = (index: number, event: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = event.target;
		const list: TableDataType[] = [...newTableData];
		switch (name) {
			case "type":
				list[index].type = value;
				list[index].length = dataTypes.find(type => type.name === value)?.maxLength.toString() || "";
				setNewTableData(list);
				break;
			case "isUnsigned":
				list[index].isUnsigned = !list[index].isUnsigned;
				setNewTableData(list);
				break;
			case "isAutoIncrement":
				list[index].isAutoIncrement = !list[index].isAutoIncrement;
				setNewTableData(list);
				break;
			case "isPrimaryKey":
				list[index].isPrimaryKey = !list[index].isPrimaryKey;
				setNewTableData(list);
				break;
			case "isUnique":
				list[index].isUnique = !list[index].isUnique;
				setNewTableData(list);
				break;
			case "isNotNull":
				list[index].isNotNull = !list[index].isNotNull;
				setNewTableData(list);
				break;
			case "isZerofill":
				list[index].isZerofill = !list[index].isZerofill;
				setNewTableData(list);
				break;
			default:
				break;
		}
	};

	const handleAddClick = () => {
		setNewTableData([...newTableData, { name: "", type: "", length: "" }]);
	};

	const handleRemoveClick = (index: number) => {
		const list = [...newTableData];
		list.splice(index, 1);
		setNewTableData(list);
	};

	const onFormSubmit = () => {
		setLoading(true);
		setOpenACModal(false);
		const newTablesJoined = newTableData
			.map(table => {
				if (table.name === "" || table.type === "") {
					setError("Please fill all fields");
					setLoading(false);
					return;
				}
				if (table.isAutoIncrement && !table.isPrimaryKey && !table.isUnique) {
					table.isPrimaryKey = true; // Default to primary key if not explicitly set
				}
				let newTable = `${table.name} ${table.type}`;
				if (table.length !== "") {
					newTable += `(${table.length})`;
				}
				if (table.isUnsigned) {
					newTable += " UNSIGNED";
				}
				if (table.isAutoIncrement) {
					newTable += " AUTO_INCREMENT";
				}
				if (table.isPrimaryKey) {
					newTable += " PRIMARY KEY";
				}
				if (table.isUnique) {
					newTable += " UNIQUE";
				}
				if (table.isNotNull) {
					newTable += " NOT NULL";
				}
				if (table.isZerofill) {
					newTable += " ZEROFILL";
				}
				return newTable;
			})
			.join(", ");

		executeQuery(`alter table ${database}.${table} add ${newTablesJoined}`, []).then(response => {
			if ("data" in response) {
				setLoading(false);
			} else if ("message" in response) {
				setError(response.message);
				setLoading(false);
			}
		});
		setLoading(false);
	};

	return (
		<div className="fixed z-10 inset-0 overflow-y-auto">
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-20">
				<div className="fixed inset-0 transition-opacity" aria-hidden="true">
					<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				<div
					className="inline-block w-fit h-fit align-bottom bg-neutral-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline">
					<p className="text-center text-xl font-bold py-2 border-b border-black">Add New Column To {database}</p>
					<div className="bg-neutral-700 px-4 pt-5 pb-4 sm:p-6">
						<form onSubmit={onFormSubmit}>
							{newTableData.map((input, i) => (
								<div key={i} className="grid gap-2 grid-row-2 grid-cols-1 mb-2 border border-white p-2">
									<div className={"grid gap-2 grid-cols-2 mb-2"}>
										<input
											name="name"
											className="w-full col-span-1 p-1 text-black border rounded focus:outline-none"
											onChange={event => handleInputChange(i, event)}
											placeholder="Column Name"
										/>
										<div className="flex col-span-1">
											<select
												name="type"
												className="w-full p-1 text-black border rounded-l focus:outline-none"
												onChange={event => handleSelectChange(i, event)}>
												<option value="">Select Type</option>
												{dataTypes.map((type, i) => (
													<option key={i} value={type.name}>
														{type.name}
													</option>
												))}
											</select>
											<input
												name="length"
												className="w-full p-1 text-black border rounded-r focus:outline-none"
												type="number"
												value={
													input.length === ""
														? dataTypes.find(type => type.name === input.type)?.maxLength
														: input.length
												}
												onChange={event => handleInputChange(i, event)}
												placeholder="Length"
												{...(dataTypes.find(type => type.name === input.type)?.canChangeLength
													? null
													: { disabled: true })}
											/>
										</div>
										{newTableData.length - 1 === i && (
											<button
												className="col-span-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
												onClick={handleAddClick}>
												Add
											</button>
										)}
										<div className={"col-span-1"}>
											{newTableData.length !== 1 && (
												<button
													className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
													onClick={() => handleRemoveClick(i)}>
													Remove
												</button>
											)}
										</div>
									</div>
									{dataOptions.map((dataOption, i) => (
										<div key={i} className="flex flex-col col-span-2 md:flex-row">
											{" "}
											{/* Changed to flex-row for horizontal layout */}
											{Object.keys(dataOption).map((option, index) => (
												<div key={index} className="flex items-center mr-2">
													{" "}
													{/* Added flex for alignment */}
													<input
														name={dataOption[option]}
														className="mr-1"
														type="checkbox"
														onChange={event => handleInputChange(i, event)}
													/>
													<label>{option}</label>
												</div>
											))}
										</div>
									))}
								</div>
							))}
							<div className="grid grid-cols-2 gap-4 justify-center">
								<button
									type="submit"
									className="inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:my-3 sm:w-full sm:text-sm">
									Create
								</button>
								<button
									onClick={() => setOpenACModal(false)}
									className="inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:my-3 sm:w-full sm:text-sm">
									Close Modal
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
