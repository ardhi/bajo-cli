import resolvePath from './resolve-path.js'
import fs from 'fs'

function isValidApp (dir) {
  dir = resolvePath(dir)
  const hasMainDir = fs.existsSync(`${dir}/main/plugin`)
  const hasPackageJson = fs.existsSync(`${dir}/package.json`)
  return hasMainDir && hasPackageJson
}

export default isValidApp
