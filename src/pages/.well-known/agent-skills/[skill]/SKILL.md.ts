import type { APIRoute, GetStaticPaths } from 'astro';
import { markdownResponse, siteOrigin } from '../../../../agent/endpoint';
import { SKILLS } from '../../../../agent/skills';

export const getStaticPaths = (() => SKILLS.map((s) => ({ params: { skill: s.name } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const skill = SKILLS.find((s) => s.name === params.skill);
  if (!skill) return new Response(null, { status: 404 });
  return markdownResponse(skill.render(siteOrigin()));
};
