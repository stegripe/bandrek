import { useContext, useEffect, useState } from "react";
import TableContext from "../components/TableContext";
import { executeQuery } from "../utils/api/executeQuery";
import Dropdown from "../components/Dropdown";
import HoverHL from "../components/HoverHL";
import Editor from "../components/Editor";

function SampleDropdown() {
    return (
        <Dropdown head="Schemas">
            <Dropdown head="Schema 2">
                <p>Table User</p>
                <p>Table Player</p>
            </Dropdown>
            <Dropdown head="Schema 1">
                <p>Table A</p>
                <p>Table B</p>
            </Dropdown>
        </Dropdown>
    )
}

function TableDropdown({ head }: { head: string }) {
    const { setSelection } = useContext(TableContext);
    const [tables, setTables] = useState<{ [K: string]: string }[] | null>(null);
    const [loading, setLoading] = useState(false);

    return <Dropdown
        onOpen={() => {
            if (tables || loading) return;

            setLoading(true);
            executeQuery(`show tables in ${head}`, []).then((response) => {
                setTables("data" in response ? response.data[0] : null);
                console.log(response);
                setLoading(false);
            });
        }}
        head={head}>
        {
            loading
                ? <p>Loading...</p>
                : tables && tables.map(tab => {
                    const name = Object.values(tab)[0];
                    return <HoverHL key={name}>
                        <button
                            onClick={() => setSelection({ database: head, table: name })}
                            className="text-left w-full h-full">
                            {name}
                        </button>
                    </HoverHL>
                })
        }
    </Dropdown>
}

export default function TestPage() {
    const [databases, setDatabases] = useState<{ Database: string }[] | null>(null);
    const [selection, setSelection] = useState<{ database: string; table: string } | null>(null);

    useEffect(() => {
        executeQuery("show databases", []).then((response) => {
            setDatabases("data" in response ? response.data[0] : null);
        });
    }, []);

    return (
        <div className="w-full h-full max-h-full text-white flex flex-col">
            <p className="w-full text-center text-xl font-bold py-2 border-b border-black">Bandrek</p>
            <TableContext.Provider value={{ selection, setSelection }}>
                <div className="w-full h-full flex">
                    <div className="w-96 max-h-full overflow-auto border-r border-black">
                        {databases && databases.map(({ Database }) => <TableDropdown head={Database} key={Database}/>)}
                    </div>
                    <div className="w-full h-full overflow-auto">
                        <Editor />
                    </div>
                </div>
            </TableContext.Provider>
        </div>
    )
}
