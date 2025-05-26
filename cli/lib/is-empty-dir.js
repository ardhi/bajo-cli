import fs from 'fs'
import emptyDir from 'empty-dir'

async function isEmptyDir (dir) {
  await fs.exists(dir)
  return await emptyDir(dir)
}

export default isEmptyDir
