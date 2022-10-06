export default async function (url: string, alias?: string) {
    const response = await fetch(import.meta.env.VITE_WORKER_URL, {
        method: "POST",
        body: JSON.stringify({
            url,
            alias,
        })
    });

    return response.json();
}