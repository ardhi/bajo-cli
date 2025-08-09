import emptyDir from 'empty-dir'

async function isEmptyDir (dir) {
  // fs.existsSync(dir)
  return await emptyDir(dir)
}

export default isEmptyDir
