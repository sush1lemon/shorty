/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
};


export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    SHORTY: KVNamespace,
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
}

interface SHORT_RESPONSE {
    code: string,
    url: string,
    shorty: string,
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const {headers, url, method} = request;
        const parsedURL = new URL(url);
        const {pathname} = parsedURL;
        const key = pathname.replace("/", "")

        switch (method) {
            case "POST":
                return this.handlePOST(request, env, parsedURL)
            case "GET":
                return this.handleGET(request, env, key)
        }

        return new Response("Hello World!");
    },

    async handlePOST(request: Request, env: Env, parsedURL: URL): Promise<Response> {
        const body: any = await request.json();
        const {protocol, hostname} = parsedURL
        let unique = false;
        let code = "";
        if (body.hasOwnProperty('url')) {
            const {url} = body;
            while (!unique) {
                code = this.generateCode(7);
                const check = await env.SHORTY.get(code);
                unique = !check;
            }
            const shorty = `${protocol}//${hostname}/${code}`;
            await env.SHORTY.put(code, url)
            const rData: SHORT_RESPONSE = {code, shorty, url}

            return new Response(JSON.stringify(rData), {headers: corsHeaders});
        }
        return new Response(null, {status: 400})
    },

    async handleGET(request: Request, env: Env, key: string): Promise<Response> {
        let link: string | null = "";

        if(key) {
            link = await env.SHORTY.get(key)
        }

        if(!link) {
            return new Response("", {status: 404})
        } else {
            return Response.redirect(link);
        }

        return new Response("Hello world", {status: 404})
    },

    generateCode(length: number) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};
