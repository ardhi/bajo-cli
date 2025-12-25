import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'
import modifyLicense from './modify-license.js'

async function copyRootFiles ({ pkg, cwd, tplDir, files }) {
  const spinner = ora(__('Copy project files')).start()
  await delay(1000)
  for (const f of files) {
    let [src, dest] = f.split(':')
    if (!dest) dest = src
    try {
      fs.copySync(`${tplDir}/skel/${src}`, `${cwd}/${dest}`)
    } catch (err) {
    }
  }
  try {
    fs.copySync(`${tplDir}/../../license/${pkg.license}`, `${cwd}/LICENSE.md`)
    await modifyLicense({ cwd, pkg })
  } catch (err) {}
  spinner.succeed()
}

export default copyRootFiles
