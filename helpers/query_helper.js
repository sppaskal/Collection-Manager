/**
 * Returns a case insensitive query for
 * a field that equals a given value. */
export function caseInsensitive (field, value) {
  return { [field]: { $regex: new RegExp(`^${value}$`, 'i') } }
}
