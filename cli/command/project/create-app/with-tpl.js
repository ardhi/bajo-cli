import fs from 'fs-extra'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import installPackages from '../lib/install-packages.js'
import modifyReadme from '../lib/modify-readme.js'
import tplCheck from '../lib/tpl-check.js'
import { getLatestPlugin } from '../../../lib/get-pkg.js'
import { __ } from '../../../lib/translate.js'
import ora from 'ora'
import { isEmpty } from 'lodash-es'

async function withTpl ({ argv, cwd, type }) {
  const tplDir = await tplCheck({ type, argv })
  let pkg
  try {
    pkg = await fs.readJSON(`${tplDir}/skel/package.json`)
  } catch (err) {
  }
  pkg.name = argv.name
  pkg.packageManager = 'npm'
  pkg.dependencies.bajo = await getLatestPlugin('bajo')

  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.env', '.gitignore', 'README.md', 'index-local.js:index.js'] })
  await modifyReadme({ cwd, argv })
  await copySkel({ cwd, tplDir })
  if (!(isEmpty(pkg.dependencies) && isEmpty(pkg.devDependencies))) await installPackages()
  ora(__('Done!')).info()
}

export default withTpl
