import { horizontal } from './create-table.js'
import isValidPlugin from './is-valid-plugin.js'
import isValidApp from './is-valid-app.js'
import readJson from './read-json.js'

function listPackages (files = [], type) {
  const validator = type === 'app' ? isValidApp : isValidPlugin
  const coll = []
  for (const f of files) {
    const pkg = readJson(f)
    if (!validator(pkg, type)) continue
    coll.push({ name: pkg.name, version: pkg.version, description: pkg.description })
  }
  horizontal(coll)
}

export default listPackages
