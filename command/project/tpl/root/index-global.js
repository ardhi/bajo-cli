import os from 'os'
import gpath from 'global-modules-path'

const path = gpath.getPath('bajo')
if (!path) {
  console.error(`Can't find bajo globally!`)
  process.exit(1)
}
let bootFile = `${path}/boot/index.js`
if (os.platform() === 'win32') bootFile = 'file:///' + bootFile
bajo = await import(bootFile)
const scope = await bajo.default()
// do whatever necessary to scope
