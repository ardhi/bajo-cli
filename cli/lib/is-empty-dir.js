import emptyDir from 'empty-dir'

async function isEmptyDir (dir, filter) {
  if (!filter) filter = (path) => ['.git'].includes(path)
  return await emptyDir(dir, filter, null)
}

export default isEmptyDir
