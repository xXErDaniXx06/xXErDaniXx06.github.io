import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { jsonResponse, siteOrigin } from '../../../agent/endpoint';
import { SKILLS } from '../../../agent/skills';

// Índice de Agent Skills (Agent Skills Discovery RFC v0.2.0). La huella es el SHA-256
// de los bytes exactos de cada SKILL.md publicado.
export const GET: APIRoute = () => {
  const origin = siteOrigin();
  return jsonResponse({
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: SKILLS.map((skill) => ({
      name: skill.name,
      type: 'skill-md',
      description: skill.description,
      url: `/.well-known/agent-skills/${skill.name}/SKILL.md`,
      digest: `sha256:${createHash('sha256').update(skill.render(origin), 'utf8').digest('hex')}`,
    })),
  });
};
