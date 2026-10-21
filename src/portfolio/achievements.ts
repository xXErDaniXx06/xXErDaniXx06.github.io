import { ACHIEVEMENTS, SCOPE_IDS, achievementYearRange, type AchievementId, type ScopeId } from '../data/achievements';
import { getDictionary, type Lang } from '../i18n';

export interface LocalizedAchievement {
  id: AchievementId;
  year: string;
  date: string;
  datetime: string;
  scope: ScopeId;
  scopeLabel: string;
  organization: string;
  prize: string;
  title: string;
  description: string;
}

export interface AchievementsSummary {
  /** «Reconocimientos · 2019–2026». */
  tag: string;
  title: string;
  /** «26 reconocimientos en más de 6 años: …». */
  summary: string;
  /** «26 reconocimientos · Local, Nacional e Internacional · 2019–2026». */
  footer: string;
  total: number;
  /** Nombre de cada ámbito, en orden. */
  scopes: string[];
}

export function getAchievements(lang: Lang): LocalizedAchievement[] {
  const t = getDictionary(lang).achievements;
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    scopeLabel: t.scopes[achievement.scope],
    ...t.items[achievement.id],
  }));
}

export function getAchievementsSummary(lang: Lang): AchievementsSummary {
  const t = getDictionary(lang).achievements;
  const total = ACHIEVEMENTS.length;
  const range = achievementYearRange();
  return {
    tag: `${t.tag} · ${range}`,
    title: t.title,
    summary: `${total} ${t.subtitle}`,
    footer: `${total} ${t.footer} · ${range}`,
    total,
    scopes: SCOPE_IDS.map((scope) => t.scopes[scope]),
  };
}
