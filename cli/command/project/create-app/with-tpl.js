import {} from 'lodash-es'
import fs from 'fs-extra'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import installPackages from '../lib/install-packages.js'
import tplCheck from '../lib/tpl-check.js'
import { __ } from '../../../lib/translate.js'
import ora from 'ora'

async function withTpl ({ argv, cwd, type }) {
  const tplDir = await tplCheck({ type, argv })
  let pkg
  try {
    pkg = fs.readJSONSync(`${tplDir}/package.json`)
  } catch (err) {
    try {
      pkg = await fs.readJSON(`${tplDir}/../../root/package.json`)
    } catch (err) {
    }
  }
  pkg.name = argv.name
  pkg.packageManager = 'npm@9.1.3'
  pkg.dependencies['global-modules-path'] = '^3.0.0'
  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.env', '.gitignore', 'README.md', 'index-hybrid.js:index.js'] })
  await copySkel({ cwd, tplDir })
  await installPackages()
  ora(__('Done!')).succeed()
}

export default withTpl
