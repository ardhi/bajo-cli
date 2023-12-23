import fs from 'fs-extra'
import ora from 'ora'
import delay from 'delay'
import { __ } from '../../../lib/translate.js'

async function ensureDir (cwd) {
  const spinner = ora(__('Ensure project dir')).start()
  await delay(1000)
  fs.ensureDirSync(cwd)
  process.chdir(cwd)
  spinner.succeed()
}

export default ensureDir
