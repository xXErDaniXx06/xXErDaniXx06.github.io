import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { describe, expect, it } from 'vitest';
import { MCP_TOOLS } from '../../src/agent/mcp-info';
import { ContactService } from '../contact/contact-service';
import type { MessageLimits } from '../contact/message-limits';
import type { MessageSender, OutgoingMessage } from '../contact/message-sender';
import { createMcpServer } from '../mcp/server';

const ORIGIN = 'https://example.test';

async function connect(sender: MessageSender | null, limits?: MessageLimits) {
  const contact = new ContactService(
    sender,
    limits ?? { check: () => Promise.resolve(null), record: () => Promise.resolve() },
    () => undefined,
  );
  const server = createMcpServer({ origin: ORIGIN, contact, caller: { userId: 'anon-1', clientName: 'Agente' } });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '1.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

const text = (result: Awaited<ReturnType<Client['callTool']>>) =>
  (result.content as { type: string; text: string }[])[0]?.text ?? '';

describe('servidor MCP', () => {
  it('anuncia las herramientas y las quince páginas como recursos', async () => {
    const client = await connect(null);
    expect((await client.listTools()).tools.map((t) => t.name)).toEqual([...MCP_TOOLS]);
    expect((await client.listResources()).resources).toHaveLength(15);
    expect(client.getServerVersion()).toMatchObject({ name: 'me.danielcarrascogarcia/portfolio' });
  });

  it('devuelve un proyecto completo en el idioma pedido', async () => {
    const client = await connect(null);
    const project = JSON.parse(
      text(await client.callTool({ name: 'get_project', arguments: { id: 'ksat', lang: 'fr' } })),
    );
    expect(project).toMatchObject({ id: 'ksat', status: 'active', period: '15/07/2025 – Actuel' });
  });

  it('filtra logros por año y ámbito', async () => {
    const client = await connect(null);
    const result = JSON.parse(
      text(
        await client.callTool({
          name: 'list_achievements',
          arguments: { lang: 'en', year: '2024', scope: 'international' },
        }),
      ),
    ) as { items: { scope: string; year: string }[] };
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => item.scope === 'International' && item.year.includes('2024'))).toBe(true);
  });

  it('get_contact_info no incluye los textos del formulario', async () => {
    const client = await connect(null);
    const info = JSON.parse(text(await client.callTool({ name: 'get_contact_info', arguments: { lang: 'es' } })));
    expect(info).toHaveProperty('personal_email');
    expect(info).not.toHaveProperty('form');
  });

  it('envía el mensaje con el pie del cliente que lo pidió', async () => {
    const sent: OutgoingMessage[] = [];
    const client = await connect({ send: (message) => (sent.push(message), Promise.resolve()) });
    const result = await client.callTool({
      name: 'send_contact_message',
      arguments: { name: 'Ana', email: 'ana@example.com', subject: 'Prácticas', message: 'Hola' },
    });
    expect(result.isError).toBeFalsy();
    expect(sent[0]?.footer).toBe('Enviado a través del servidor MCP del porfolio por el cliente "Agente".');
  });

  it('explica al agente por qué no se envió', async () => {
    const client = await connect(null);
    const result = await client.callTool({
      name: 'send_contact_message',
      arguments: { name: 'Ana', email: 'ana@example.com', subject: 'S', message: 'M' },
    });
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/not configured/);
  });
});
