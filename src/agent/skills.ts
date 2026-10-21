// Agent Skills (agentskills.io) publicadas en /.well-known/agent-skills/ para que
// los agentes sepan usar el porfolio. El índice y sus huellas se generan al compilar.

import { CONTACT, PERSON_NAME } from '../data/profile';

export interface AgentSkill {
  name: string;
  description: string;
  /** Contenido de SKILL.md para el origen dado. */
  render: (origin: string) => string;
}

export const SKILLS: readonly AgentSkill[] = [
  {
    name: 'daniel-carrasco-portfolio',
    description:
      'Answer questions about Daniel Carrasco García, a Computer Engineering student at the University of Málaga working on software, embedded hardware, RF/LoRa links and aerospace projects, using the machine-readable versions of his portfolio. Use it for his background, projects, skills, awards, CV or availability.',
    render: (o: string) => `---
name: daniel-carrasco-portfolio
description: Answer questions about Daniel Carrasco García (Computer Engineering student at the University of Málaga; software, embedded hardware, RF/LoRa and aerospace projects) using the machine-readable versions of his portfolio. Use it for his background, projects, skills, awards, CV or availability.
---

# ${PERSON_NAME}'s portfolio

The portfolio at ${o} is published in Spanish (\`es\`, default), English (\`en\`) and French (\`fr\`). Answer in the user's language and read the matching version.

## Sources

Use the first one that works for you; they all hold the same content.

1. **JSON API** (no authentication): \`${o}/api/v1/{lang}/{resource}.json\` with resource \`portfolio\` (everything), \`profile\`, \`projects\`, \`skills\`, \`achievements\` or \`contact\`. Description: ${o}/api/v1/openapi.json
2. **Markdown pages**: \`${o}/{lang}/{page}.md\` with page \`index\`, \`proyectos\` (projects), \`habilidades\` (skills), \`logros\` (achievements) or \`contacto\` (contact). Any page URL also returns Markdown when you send \`Accept: text/markdown\`. All pages in one file: ${o}/llms-full.txt
3. **MCP server** at \`${o}/mcp\` (OAuth 2.1, see ${o}/auth.md): tools \`get_profile\`, \`list_projects\`, \`get_project\`, \`list_skills\`, \`list_achievements\`, \`get_contact_info\` and \`get_page_markdown\`.
4. **In a browser on the site**: WebMCP tools \`get_page_content\` and \`get_portfolio_data\`.

## How to answer

- Quote facts as they appear (names of projects, organizations, dates, prizes); do not infer grades, employers or dates that are not listed.
- Link to the human page the fact comes from, for example ${o}/en/proyectos#project-ksat or ${o}/es/logros.
- Projects have a status (\`active\` or \`completed\`) and a period; achievements have a date, a scope (international, national, regional…) and the awarding body.
- For the full CV, link ${o}${CONTACT.cvPath} rather than summarizing it from memory.
- If the user wants to reach Daniel, use the \`contact-daniel-carrasco\` skill.

## Examples

- "What is Daniel working on now?" → \`projects.json\`, items with \`status: "active"\`.
- "Has he won international awards?" → \`achievements.json\`, items whose scope is \`Internacional\` / \`International\`.
- "Which RF tools does he know?" → \`skills.json\`, category \`rf-embedded\`.
`,
  },
  {
    name: 'contact-daniel-carrasco',
    description:
      "Help someone get in touch with Daniel Carrasco García (job offers, internships, research or project collaborations): gives his contact channels and, with the user's explicit approval, sends him a message through his portfolio's MCP server or contact form.",
    render: (o: string) => `---
name: contact-daniel-carrasco
description: Help someone get in touch with Daniel Carrasco García (job offers, internships, research or project collaborations). Gives his contact channels and, with the user's explicit approval, sends him a message through his portfolio's MCP server or contact form.
---

# Contacting ${PERSON_NAME}

## Channels

- Personal email: ${CONTACT.personalEmail}
- University email (UMA): ${CONTACT.umaEmail}
- Phone: ${CONTACT.phone.display} (${CONTACT.phone.e164})
- LinkedIn: ${CONTACT.linkedin.url}
- GitHub: ${CONTACT.github.url}
- CV (PDF): ${o}${CONTACT.cvPath}

Meeting hours and spoken languages are in \`${o}/api/v1/en/contact.json\` (\`meetings\`, \`languages\`).

## Sending a message

1. Collect the sender's name, a reply email, a subject and the message. Write the message in the language the user prefers; Daniel reads Spanish, English and French.
2. Show the final text to the user and get an explicit "yes" before sending. Never send on your own initiative and never send the same message twice.
3. Send it with one of these:
   - **MCP server**: tool \`send_contact_message\` at \`${o}/mcp\`. It needs the \`contact:send\` scope; the person approves it on the authorization page (see ${o}/auth.md). At most 3 messages per hour.
   - **In the browser**: on ${o}/es/contacto (or \`/en/contacto\`, \`/fr/contacto\`) the form is the WebMCP tool \`send_contact_message\`. The person confirms by pressing the send button.
   - Otherwise, give the user a \`mailto:${CONTACT.personalEmail}\` link with the subject and body filled in.
4. If sending fails or the limit is reached, offer the email address instead of retrying.
`,
  },
];
