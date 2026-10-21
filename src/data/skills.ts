// Categorías de habilidades en el orden en que se muestran. Las habilidades de cada
// categoría (nombre y nota) están en src/i18n/, en `skills.categories`, con la misma clave.

export const SKILL_CATEGORY_IDS = ['programming', 'rf-embedded', 'tools', 'languages'] as const;

export type SkillCategoryId = (typeof SKILL_CATEGORY_IDS)[number];
