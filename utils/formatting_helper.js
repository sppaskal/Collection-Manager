export function snakeToCamel (obj) {
  if (!obj || typeof obj !== 'object') return obj

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    acc[camelKey] = Array.isArray(obj[key])
      ? obj[key].map(snakeToCamel)
      : snakeToCamel(obj[key])
    return acc
  }, {})
}

export function camelToSnake (obj) {
  if (!obj || typeof obj !== 'object') return obj

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    acc[snakeKey] = Array.isArray(obj[key])
      ? obj[key].map(camelToSnake)
      : camelToSnake(obj[key])
    return acc
  }, {})
}
