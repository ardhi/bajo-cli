import os from 'os'
import gpath from 'global-modules-path'
import { __, fatal } from '../../../../lib/translate.js'

let bajo
try {
  bajo = await import('bajo')
} catch (err) {}
if (!bajo) {
  const path = gpath.getPath('bajo')
  if (!path) fatal(`Can't find bajo either locally nor globally!`)
  let bootFile = `${path}/boot/index.js`
  if (os.platform() === 'win32') bootFile = 'file:///' + bootFile
  bajo = await import(bootFile)
}
const scope = await bajo.default()
// do whatever necessary to scope
