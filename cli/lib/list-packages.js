import { horizontal } from './create-table.js'
import { __ } from '../lib/translate.js'
import ora from 'ora'
import delay from 'delay'
import getPkg from './get-pkg.js'

async function listPackages (files = [], type, argv) {
  const coll = []
  const spinner = ora(__('Collecting plugins...')).start()
  for (const f of files) {
    const info = await getPkg(f, type, argv.npmLastVersion)
    if (!info) continue
    spinner.text = info.name
    if (!argv.npmLastVersion) await delay(20)
    coll.push(info)
  }
  spinner.stop()
  horizontal(coll)
}

export default listPackages
