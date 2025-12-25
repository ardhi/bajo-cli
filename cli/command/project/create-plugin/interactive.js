import buildPackageJson from '../lib/build-package-json.js'
import customInstall from '../lib/custom-install.js'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import installPackages from '../lib/install-packages.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copySkel from '../lib/copy-skel.js'
import modifyPluginFactory from '../lib/modify-plugin-factory.js'
import modifyReadme from '../lib/modify-readme.js'
import endOfISession from '../lib/end-of-isession.js'
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
  argv.tpl = session.ext.tpl
  const tplDir = await tplCheck({ type, argv })
  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.gitignore', 'index.js', 'README.md'] })
  await modifyPluginFactory({ cwd, argv })
  await modifyReadme({ cwd, argv })
  await copySkel({ cwd, tplDir })
  if (!(isEmpty(pkg.dependencies) && isEmpty(pkg.devDependencies))) await installPackages()
  if (session.ext.dependencies.length > 0) {
    const file = `${cwd}/index.js`
    let content = fs.readFileSync(file, 'utf8')
    content = content.replace('this.dependencies = []', `this.dependencies = ['${session.ext.dependencies.join(', ')}']`)
    fs.writeFileSync(file, content, 'utf8')
  }
  ora(__('Done!')).info()
}

export default interactive
