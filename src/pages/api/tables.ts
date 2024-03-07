import connection from "../../index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function tables(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const db = req.query["db"];
    if (!db) {
        res.status(400).json({ message: "Ngawur cik, mana nama dbnya???" });
        return;
    }

    const query = await connection.query("SHOW TABLES");
    res.status(200).json(query);
}
