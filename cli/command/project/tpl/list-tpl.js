import fastGlob from 'fast-glob'
import currentLoc from 'bajo/boot/helper/current-loc.js'

async function listTpl (type) {
  let dir = currentLoc(import.meta).dir
  dir = `${dir}/create-${type}`
  return await fastGlob(`${dir}/*`, { onlyDirectories: true })
}

export default listTpl
