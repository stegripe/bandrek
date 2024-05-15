import { createContext } from "react";

const TableContext = createContext<{
    selection: {
        database: string;
        table: string;
    } | null;
    setSelection: (selection: {
        database: string;
        table: string;
    }) => void;
}>({
    selection: null,
    setSelection: () => {}
});

export default TableContext;
