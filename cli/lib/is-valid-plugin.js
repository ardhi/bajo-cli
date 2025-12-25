import resolvePath from 'aneka/src/resolve-path.js'
import readJson from './read-json.js'
import get from 'lodash-es/get.js'
import isObject from 'lodash-es/isObject.js'
import path from 'path'

export function isValid (file, type, returnPkg) {
  if (isObject(file)) return get(file, 'bajo.type') === type
  file = resolvePath(file)
  if (path.basename(file) !== 'package.json') file += '/package.json'
  try {
    const pkg = readJson(file)
    const valid = get(pkg, 'bajo.type') === type
    if (valid) return returnPkg ? pkg : valid
    return false
  } catch (err) {
    return false
  }
}

function isValidPlugin (file, returnPkg) {
  return isValid(file, 'plugin', returnPkg)
}

export default isValidPlugin
