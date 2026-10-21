import { SKILL_CATEGORY_IDS, type SkillCategoryId } from '../data/skills';
import { getDictionary, type Lang, type SkillCategoryText } from '../i18n';

export interface LocalizedSkillCategory extends SkillCategoryText {
  id: SkillCategoryId;
}

export function getSkillCategories(lang: Lang): LocalizedSkillCategory[] {
  const t = getDictionary(lang).skills;
  return SKILL_CATEGORY_IDS.map((id) => ({ id, ...t.categories[id] }));
}
