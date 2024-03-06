import connection from "../../index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function columns(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const table = req.query["table"];
    if (!table) {
        res.status(400).json({ message: "Ngawur cik, mana nama tablenya???" });
        return;
    }

    const columns = await connection.query({
        query: "SHOW COLUMNS FROM ?",
        values: [table]
    });

    res.status(200).json(columns);
}
