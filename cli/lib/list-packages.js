import { horizontal } from './create-table.js'
import readJson from 'bajo/boot/helper/read-json.js'
import { __ } from './translate.js'

function listPackages (files, { emptyFiles = __('No package found') } = {}) {
  if (files.length === 0) return console.log(emptyFiles)
  const coll = []
  for (const f of files) {
    const pkg = readJson(`${f}/package.json`)
    coll.push({ name: pkg.name, version: pkg.version, description: pkg.description })
  }
  horizontal(coll)
}

export default listPackages
