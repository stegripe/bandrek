export async function request(url: string, method: string, body: any): Promise<APIResult> {
    const options: RequestInit = { method };

    if (body !== undefined) {
        options.body = typeof body === "string" ? body : JSON.stringify(body);
        options.headers = {
            "Content-Type": "application/json"
        }
    }

    const response = await fetch(url, options);
    return response.json();
}
