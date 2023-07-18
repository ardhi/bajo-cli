import os from 'os'
import gpath from 'global-modules-path'
import { fatal } from '../../../../lib/translate.js'

const path = gpath.getPath('bajo')
if (!path) fatal('Can\'t find bajo globally!')
let bootFile = `${path}/boot/index.js`
if (os.platform() === 'win32') bootFile = 'file:///' + bootFile
const bajo = await import(bootFile)
const scope = await bajo.default()
// do whatever necessary to scope
