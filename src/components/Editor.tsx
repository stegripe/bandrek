import { useContext, useEffect, useState } from "react";
import { executeQuery } from "../utils/api/executeQuery";
import TableContext from "./TableContext";

export default function Editor() {
    const { selection } = useContext(TableContext);
    const [columns, setColumns] = useState<string[] | null>(null);
    const [values, setValues] = useState<{ [K: string]: any }[] | null>(null);

    useEffect(() => {
        if (!selection) return;

        executeQuery(`show columns from ${selection.table} from ${selection.database}`, []).then((response) => {
            if ("data" in response) {
                const data: { Field: string }[] = response.data[0];
                setColumns(data.map((col) => col.Field));

                executeQuery(`use ${selection.database};`, []).then((response) => {
                    if ("data" in response) {
                        executeQuery(`select * from ${selection.table}`, []).then((response) => {
                            if ("data" in response) {
                                setValues(response.data[0]);
                            }
                        });
                    }
                });
            }
        });
    }, [selection]);

    return (
        selection
            ? (
                columns
                    ? (
                        <table className="table-auto">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                        </table>
                    )
                    : (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <p className="text-2xl font-bold">Database: {selection.database}</p>
                            <p className="text-2xl font-bold">Table: {selection.table}</p>
                        </div>
                    )
            )
            : (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <p className="text-2xl font-bold">No table selected</p>
                </div>
            )
    )
}
