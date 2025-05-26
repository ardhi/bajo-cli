import resolvePath from './resolve-path.js'
import fs from 'fs'

function isValidPlugin (dir) {
  dir = resolvePath(dir)
  const hasPluginDir = fs.existsSync(`${dir}/plugin`)
  const hasPackageJson = fs.existsSync(`${dir}/package.json`)
  return hasPluginDir && hasPackageJson
}

export default isValidPlugin
