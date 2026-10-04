import { isArmyDraft, type ArmyDraft } from './army-builder';

/** Recover valid drafts independently if one stored draft has been damaged. */
export function validateArmyDrafts(
  value: unknown,
): Record<string, ArmyDraft> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return undefined;
  return Object.fromEntries(
    Object.entries(value).filter(([, draft]) => isArmyDraft(draft)),
  );
}
