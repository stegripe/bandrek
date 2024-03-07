import connection from "../../index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function tables(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const db = req.query["db"];
    if (!db) {
        res.status(400).json({ message: "Invalid database name" });
        return;
    }

    const query = await connection.query({
        query: "SHOW TABLES FROM ?",
        values: [db]
      });
    res.status(200).json(query);
}
