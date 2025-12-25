import buildPackageJson from '../lib/build-package-json.js'
import customInstall from '../lib/custom-install.js'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import modifyReadme from '../lib/modify-readme.js'
import installPackages from '../lib/install-packages.js'
import endOfISession from '../lib/end-of-isession.js'
import { getLatestPlugin } from '../../../lib/get-pkg.js'
import tplCheck from '../lib/tpl-check.js'
import { __ } from '../../../lib/translate.js'
import fs from 'fs-extra'
import ora from 'ora'
import { isEmpty } from 'lodash-es'

async function interactive ({ argv, cwd, type, session }) {
  session.pkg = await buildPackageJson({ argv, session, type })
  session.ext = await customInstall({ argv, type, session })
  const answer = await endOfISession()
  if (answer === 'e') await interactive({ argv, cwd, type, session })
  else if (answer === 'n') {
    ora(__('Aborted!')).warn()
    process.kill(process.pid, 'SIGINT')
  }
  const pkg = session.pkg
  pkg.dependencies = pkg.dependencies ?? {}
  pkg.devDependencies = pkg.devDependencies ?? {}
  pkg.packageManager = 'npm'
  if (session.ext.bootFile !== 'local') pkg.dependencies['get-global-path'] = await getLatestPlugin('get-global-path')
  else {
    pkg.dependencies.bajo = await getLatestPlugin('bajo')
    for (const p of session.ext.plugins) {
      pkg.dependencies[p] = await getLatestPlugin(p, argv.registry, 'plugin')
    }
  }
  argv.tpl = session.ext.tpl
  const tplDir = await tplCheck({ type, argv })
  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.env', '.gitignore', 'README.md', `index-${session.ext.bootFile}.js:index.js`] })
  await modifyReadme({ cwd, argv })
  await copySkel({ cwd, tplDir })
  if (!(isEmpty(pkg.dependencies) && isEmpty(pkg.devDependencies))) await installPackages()
  if (session.ext.plugins.length > 0) {
    const file = `${cwd}/data/config/.plugins`
    const contents = session.ext.plugins.join('\n')
    fs.writeFileSync(file, contents, 'utf8')
  }
  ora(__('Done!')).info()
}

export default interactive
