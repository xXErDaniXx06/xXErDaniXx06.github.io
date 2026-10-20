import type { APIRoute, GetStaticPaths } from 'astro';
import { siteOrigin, textResponse } from '../../../../agent/site.js';
import { SKILLS } from '../../../../agent/skills.js';

export const getStaticPaths: GetStaticPaths = () => SKILLS.map((s) => ({ params: { skill: s.name } }));

export const GET: APIRoute = ({ params }) => {
  const skill = SKILLS.find((s) => s.name === params.skill)!;
  return textResponse(skill.render(siteOrigin()), 'text/markdown; charset=utf-8');
};
