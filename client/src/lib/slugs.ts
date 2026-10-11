/**
 * Generates a clean URL slug from a team member's name.
 * e.g. "Vempati Uday Kiran" -> "vempati-uday-kiran"
 */
export function getMemberSlug(name?: string, fallbackId?: string): string {
  if (!name || !name.trim()) return fallbackId || '';
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallbackId || '';
}

/**
 * Checks if a member matches a given slug or identifier.
 * Works seamlessly whether the identifier is:
 * - MongoDB ObjectId
 * - Numeric order
 * - Hyphenated slug ("vempati-uday-kiran")
 * - Underscored slug ("vempati_uday_kiran")
 * - Raw name ("Vempati Uday Kiran")
 */
export function isMemberMatch(
  member: { id?: string; _id?: string; order?: number | string; name?: string },
  identifier: string
): boolean {
  if (!identifier) return false;
  const target = decodeURIComponent(identifier).trim().toLowerCase();

  // 1. Direct ID / _id match
  if (member.id && member.id.toLowerCase() === target) return true;
  if (member._id && member._id.toLowerCase() === target) return true;

  // 2. Numeric order match
  if (member.order !== undefined && String(member.order) === target) return true;

  // 3. Slug or Name matching
  if (member.name) {
    const memberSlug = getMemberSlug(member.name);
    if (memberSlug === target) return true;

    // Strip all non-alphanumerics to match name_of_the_member vs name-of-the-member vs name of the member
    const cleanTarget = target.replace(/[^a-z0-9]/g, '');
    const cleanName = member.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanTarget && cleanTarget === cleanName) return true;
  }

  return false;
}
