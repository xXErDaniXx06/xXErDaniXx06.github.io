/** Añade campos a una respuesta JSON correcta de la librería OAuth. */
export async function addJsonFields(response: Response, fields: Record<string, unknown>): Promise<Response> {
  if (!response.ok) return response;
  const body = { ...((await response.json()) as Record<string, unknown>), ...fields };
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  return new Response(JSON.stringify(body, null, 2), { status: response.status, headers });
}
