/** Partes del porfolio que se publican por separado en la API JSON (/api/v1/{lang}/{resource}.json). */
export const PORTFOLIO_RESOURCES = ['portfolio', 'profile', 'projects', 'skills', 'achievements', 'contact'] as const;

export type PortfolioResource = (typeof PORTFOLIO_RESOURCES)[number];
