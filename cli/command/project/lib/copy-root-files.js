import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'

async function copyRootFiles ({ pkg, cwd, tplDir, files }) {
  const spinner = ora(__('Copy project files')).start()
  await delay(1000)
  for (const f of files) {
    let [src, dest] = f.split(':')
    if (!dest) dest = src
    try {
      fs.copySync(`${tplDir}/${src}`, `${cwd}/${dest}`)
    } catch (err) {
      try {
        fs.copySync(`${tplDir}/../../root/${src}`, `${cwd}/${dest}`)
      } catch (err) {}
    }
  }
  try {
    fs.copySync(`${tplDir}/../../license/${pkg.license}`, `${cwd}/LICENSE.md`)
  } catch (err) {}
  spinner.succeed()
}

export default copyRootFiles
