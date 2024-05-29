import { useContext, useEffect, useState } from "react";
import { executeQuery } from "../utils/api/executeQuery";
import TableContext from "./TableContext";

export default function Editor() {
    const { selection } = useContext(TableContext);
    const [columns, setColumns] = useState<{ Field: string; Type: string; Key: string }[] | null>(null);
    const [values, setValues] = useState<{ [K: string]: any }[] | null>(null);

    useEffect(() => {
        if (!selection) return;

        columns && setColumns(null);
        values && setValues(null);

        executeQuery(`show columns from ${selection.table} from ${selection.database}`, []).then((response) => {
            if ("data" in response) {
                console.log("columns", response.data[0]);
                const data: { Field: string; Type: string; Key: string }[] = response.data[0];
                setColumns(data);

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
                        <table className="table-fixed border-collapse">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col.Field} className="border-b border-r border-black py-1 px-2">{col.Field} ({col.Type}) {col.Key === "PRI" ? "(PK)" : col.Key === "MUL" ? "(FK)" : ""}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {values && values.map((row, i) => (
                                    <tr key={i}>
                                        {columns.map((col) => (
                                            <td key={col.Field} className="border-b border-r border-black py-1 px-2">{row[col.Field] ?? "NULL"}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
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
