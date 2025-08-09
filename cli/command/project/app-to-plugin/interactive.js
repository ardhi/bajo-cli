import buildPackageJson from '../lib/build-package-json.js'
import ensureDir from '../lib/ensure-dir.js'
import writePackageJson from '../lib/write-package-json.js'
import copyRootFiles from '../lib/copy-root-files.js'
import copyMain from '../lib/copy-main.js'
import modifyReadme from '../lib/modify-readme.js'
import endOfISession from '../lib/end-of-isession.js'
import tplCheck from '../lib/tpl-check.js'
import { __ } from '../../../lib/translate.js'
import ora from 'ora'

async function interactive ({ argv, cwd, type, session }) {
  session.pkg = await buildPackageJson({ argv, session, type })
  const answer = await endOfISession()
  if (answer === 'e') await interactive({ argv, cwd, type, session })
  else if (answer === 'n') {
    ora(__('Aborted!')).warn()
    process.kill(process.pid, 'SIGINT')
  }
  const pkg = session.pkg
  pkg.dependencies = pkg.dependencies ?? {}
  pkg.devDependencies = pkg.devDependencies ?? {}
  argv.tpl = 'minimal'
  const tplDir = await tplCheck({ type, argv })
  await ensureDir(cwd)
  await writePackageJson({ argv, cwd, pkg })
  await copyRootFiles({ pkg, cwd, tplDir, files: ['.gitignore', 'README.md'] })
  await modifyReadme({ cwd, argv })
  await copyMain({ cwd, argv })
  ora(__('Done!')).info()
}

export default interactive
