// Sustituto de `cloudflare:workers` para ejecutar las pruebas en Node: la librería OAuth
// solo usa WorkerEntrypoint para distinguir clases de objetos manejadores.
export class WorkerEntrypoint {
  readonly stub = true;
}
