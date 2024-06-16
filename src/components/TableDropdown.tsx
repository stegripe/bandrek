import { executeQuery } from "../utils/api/executeQuery";
import TableContext from "./TableContext";
import Dropdown from "./Dropdown";
import HoverHL from "./HoverHL";

import { useContext, useState } from "react";

export default function TableDropdown({ head }: { head: string }) {
	const { setSelection } = useContext(TableContext);
	const [tables, setTables] = useState<{ [K: string]: string }[] | null>(null);
	const [loading, setLoading] = useState(false);

	return (
		<Dropdown
			onOpen={() => {
				if (tables || loading) return;

				setLoading(true);
				executeQuery(`show tables in ${head}`, []).then(response => {
					setTables("data" in response ? response.data[0] : null);
					console.log(response);
					setLoading(false);
				});
			}}
			onClose={() => setTables(null)}
			head={head}>
			{loading ? (
				<p>Loading...</p>
			) : (
				tables &&
				tables.map(tab => {
					const name = Object.values(tab)[0];
					return (
						<HoverHL key={name}>
							<button
								onClick={() => setSelection({ database: head, table: name })}
								className="text-left w-full h-full">
								{name}
							</button>
						</HoverHL>
					);
				})
			)}
		</Dropdown>
	);
}
