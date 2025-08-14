import { fatal, __ } from '../lib/translate.js'
import ora from 'ora'
import delay from 'delay'
import getPkg from './get-pkg.js'
import { pick } from 'lodash-es'

async function listPackages (files = [], type, argv, picked) {
  const coll = []
  const spinner = ora(__('Collecting %ss...', type)).start()
  for (const f of files) {
    const info = await getPkg(f, type, argv)
    if (!info) continue
    spinner.text = info.name
    if (!argv.npmVersion) await delay(10)
    if (argv.onlyUnmatch && argv.npmVersion) {
      if (!info.versionMatch) coll.push(picked ? pick(info, picked) : info)
    } else coll.push(picked ? pick(info, picked) : info)
  }
  spinner.stop()
  if (coll.length === 0) fatal('No %ss detected!', type)
  return coll
}

export default listPackages
