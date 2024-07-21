import { executeQuery } from "../utils/api/executeQuery";
import TableContext from "./TableContext";
import Dropdown from "./Dropdown";
import HoverHL from "./HoverHL";
import { useContext, useState } from "react";

export default function TableDropdown({
	tables,
	setTables,
	head,
	handleRightClick
}: {
	tables: { [K: string]: string }[] | null;
	setTables: (tables: { [K: string]: string }[] | null) => void;
	head: string;
	handleRightClick: (event: React.MouseEvent, type: string, database?: string, table?: string) => void;
}) {
	const { setSelection } = useContext(TableContext);
	const [loading, setLoading] = useState(false);

	return (
		<Dropdown
			onOpen={() => {
				if (tables || loading) return;

				setLoading(true);
				executeQuery(`show tables from ${head}`, []).then(response => {
					setTables("data" in response ? response.data[0] : null);
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
								onContextMenu={e => {
									e.stopPropagation();
									handleRightClick(e, "table", head, name);
								}}
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
