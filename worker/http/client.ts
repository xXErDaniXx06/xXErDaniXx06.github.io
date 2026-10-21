/** Cliente HTTP para las peticiones salientes (fetch, o fetch firmado con Web Bot Auth). */
export type HttpClient = (url: string, init?: RequestInit) => Promise<Response>;
