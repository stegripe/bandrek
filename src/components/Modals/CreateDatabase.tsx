import { executeQuery } from "../../utils/api/executeQuery";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export default function CreateDatabaseModal({
	setOpenCDModal,
	setDatabases,
	openCDModal,
	setLoading,
	collations,
	setError
}: {
	setDatabases: Dispatch<SetStateAction<{ Database: string }[] | null>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setOpenCDModal: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	collations: string[] | null;
	openCDModal: boolean;
}) {
	const [newDatabaseData, setNewDatabaseData] = useState<DatabaseDataType[]>([{ name: "", collation: "" }]);

	const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		const list: DatabaseDataType[] = [...newDatabaseData];
		if (list[index] && name === "name") {
			list[index].name = value;
			setNewDatabaseData(list);
		}
	};

	const handleSelectChange = (index: number, event: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = event.target;
		const list: DatabaseDataType[] = [...newDatabaseData];
		if (list[index] && name === "collation") {
			list[index].collation = value;
			setNewDatabaseData(list);
		}
	};

	const handleAddClick = () => {
		setNewDatabaseData([...newDatabaseData, { name: "", collation: "" }]);
	};

	const handleRemoveClick = (index: number) => {
		const list = [...newDatabaseData];
		list.splice(index, 1);
		setNewDatabaseData(list);
	};

	const onFormSubmit = () => {
		setLoading(true);
		setOpenCDModal(false);
		newDatabaseData.forEach(database => {
			if (database.name === "" || database.collation === "") {
				setError("Please fill all fields");
				setLoading(false);
				return;
			}
			executeQuery(`create database ${database.name} collate ${database.collation}`, []).then(response => {
				if ("data" in response) {
					executeQuery("show databases", []).then(response => {
						setDatabases("data" in response ? response.data[0] : null);
						setLoading(false);
					});
				} else if ("message" in response) {
					setError(response.message);
					setLoading(false);
				}
			});
		});
	};

	return (
		<div className="fixed z-10 inset-0 overflow-y-auto">
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div className="fixed inset-0 transition-opacity" aria-hidden="true">
					<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				<div
					className="inline-block w-fit h-fit align-bottom bg-neutral-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline">
					<p className="text-center text-xl font-bold py-2 border-b border-black">Create Database</p>
					<div className="bg-neutral-700 px-4 pt-5 pb-4 sm:p-6">
						<form onSubmit={onFormSubmit}>
							{newDatabaseData.map((input, i) => (
								<div key={i} className={"grid gap-2 grid-cols-5 mb-2"}>
									<input
										name="name"
										className="w-full col-span-2 p-1 text-black border rounded focus:outline-none"
										value={input.name}
										onChange={event => handleInputChange(i, event)}
										placeholder="Name"
									/>
									<select
										name="collation"
										className="w-full p-1 col-span-2 text-black border rounded focus:outline-none"
										value={input.collation}
										onChange={event => handleSelectChange(i, event)}>
										<option value="" disabled>
											Choose Collation
										</option>
										{collations?.map((collation, i) => (
											<option key={i} value={collation}>
												{collation}
											</option>
										))}
									</select>
									<div className={"col-span-1"}>
										{newDatabaseData.length !== 1 && (
											<button
												className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
												onClick={() => handleRemoveClick(i)}>
												Remove
											</button>
										)}
									</div>
									{newDatabaseData.length - 1 === i && (
										<button
											className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
											onClick={handleAddClick}>
											Add
										</button>
									)}
								</div>
							))}
							<div className="grid grid-cols-2 gap-4 justify-center">
								<button
									type="submit"
									className="inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:my-3 sm:w-full sm:text-sm">
									Create
								</button>
								<button
									onClick={() => setOpenCDModal(false)}
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
