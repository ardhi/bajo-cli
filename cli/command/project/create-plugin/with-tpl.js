import fs from 'fs-extra'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import installPackages from '../lib/install-packages.js'
import modifyPluginFactory from '../lib/modify-plugin-factory.js'
import modifyReadme from '../lib/modify-readme.js'
import tplCheck from '../lib/tpl-check.js'
import { __ } from '../../../lib/translate.js'
import ora from 'ora'

async function withTpl ({ argv, cwd, type }) {
  const tplDir = await tplCheck({ type, argv })
  let pkg = {}
  try {
    pkg = await fs.readJSON(`${tplDir}/skel/package.json`)
  } catch (err) {
  }
  pkg.name = argv.name
  pkg.packageManager = 'npm'
  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.env', '.gitignore', 'index.js', 'README.md'] })
  await modifyPluginFactory({ cwd, argv })
  await modifyReadme({ cwd, argv })
  await copySkel({ cwd, tplDir })
  await installPackages()
  ora(__('Done!')).info()
}

export default withTpl
