import connection from "../../index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function retrieveAll(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const table = req.query["table"];
    if (!table) {
        res.status(400).json({ message: "Invalid table name." });
        return;
    }

    const datas = await connection.query({
        query: "SELECT * FROM ?",
        values: [table]
    });

    res.status(200).json(datas);
}
