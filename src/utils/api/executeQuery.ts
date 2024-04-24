import { QUERY_EXECUTION } from "./endpoints";
import { request } from "./request";

export async function executeQuery(query: string, values: any[]) {
    const response = await request(QUERY_EXECUTION, "POST", {
        query,
        values,
    });

    // Will add checking later here...

    return response;
}
