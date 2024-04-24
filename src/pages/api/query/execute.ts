import connection from "../../../index";
import { NextApiRequest, NextApiResponse } from "next";

export default async function executeQuery(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.body.query) {
        res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid query" });
        return;
    }

    try {
        const r = await connection.query(req.body.query, {
            replacements: req.body.values,
        });

        res.status(200).json({ code: 200, status: "OK", data: r });
    } catch (e) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: (e as Error).message });
    }
}
