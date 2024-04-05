import buildPackageJson from '../lib/build-package-json.js'
import customInstall from '../lib/custom-install.js'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import installPackages from '../lib/install-packages.js'
import endOfISession from '../lib/end-of-isession.js'
import tplCheck from '../lib/tpl-check.js'
import { __ } from '../../../lib/translate.js'
import fs from 'fs-extra'
import ora from 'ora'

async function interactive ({ argv, cwd, type, session }) {
  session.pkg = await buildPackageJson({ argv, session })
  session.ext = await customInstall({ argv, type, session })
  const answer = await endOfISession()
  if (answer === 'e') await interactive({ argv, cwd, type, session })
  else if (answer === 'n') {
    ora(__('Aborted!')).fail()
    process.kill(process.pid, 'SIGINT')
  } else {
    const pkg = session.pkg
    pkg.dependencies = pkg.dependencies ?? {}
    pkg.devDependencies = pkg.devDependencies ?? {}
    pkg.packageManager = 'npm@9.1.3'
    if (session.ext.bootFile !== 'local') pkg.dependencies['global-modules-path'] = '^3.0.0'
    else {
      pkg.dependencies.bajo = 'latest' // TODO
      for (const p of session.ext.plugins) {
        pkg.dependencies[p] = 'latest'
      }
    }
    argv.tpl = session.ext.tpl
    const tplDir = await tplCheck({ type, argv })
    await ensureDir(cwd)
    await writePackageJson({ argv, cwd, pkg })
    await copyRootFiles({ pkg, cwd, tplDir, files: ['.env', '.gitignore', 'README.md', `${session.ext.bootFile}:index.js`] })
    await copySkel({ cwd, tplDir })
    if (session.ext.plugins.length > 0) {
      const file = `${cwd}/data/config/bajo.json`
      const cfg = fs.readJSONSync(file)
      cfg.plugins = session.ext.plugins
      fs.writeJSONSync(file, cfg, { spaces: 2 })
    }
    await installPackages()
    ora(__('Done!')).succeed()
  }
}

export default interactive
