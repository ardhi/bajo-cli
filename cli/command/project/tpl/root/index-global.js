import os from 'os'
import gpath from 'global-modules-path'

const path = gpath.getPath('bajo')
if (!path) {
  console.error('Can\'t find bajo either locally nor globally!')
  process.exit(1)
}
let bootFile = `${path}/boot/index.js`
if (os.platform() === 'win32') bootFile = 'file:///' + bootFile
const bajo = await import(bootFile)
await bajo.default()
