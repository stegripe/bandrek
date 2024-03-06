import connection from "../../index"; // ts server nya stress
import { NextApiRequest, NextApiResponse } from "next";

export default async function tables(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query = await connection.query("SHOW TABLES");
    res.status(200).json(query);
}
