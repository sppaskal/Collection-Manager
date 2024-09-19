/**
 * Returns a case insensitive query for
 * a field that equals a given value. */
export function caseInsensFullMatch (field, value) {
  return { [field]: { $regex: new RegExp(`^${value}$`, 'i') } }
}

/**
 * Returns a case insensitive query for
 * a field that is a partial match for a
 * given value (subset of that value) */
export function caseInsensPartMatch (field, value) {
  return { [field]: { $regex: new RegExp(value, 'i') } }
}
