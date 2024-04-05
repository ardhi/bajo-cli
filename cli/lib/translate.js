import y18n from 'y18n'
import currentLoc from 'bajo/boot/helper/current-loc.js'

export function getLang () {
  let lang
  const item = process.argv.find(i => i.startsWith('--lang'))
  if (item) lang = item.split('=')[1]
  return lang
}

const baseDir = currentLoc(import.meta).dir
const instance = y18n({
  locale: getLang() ?? 'en',
  directory: `${baseDir}/../locale`,
  updateFiles: false
})

export function __ (...args) {
  return instance.__(...args)
}

export function fatal (...args) {
  console.error(instance.__(...args))
  process.kill(process.pid, 'SIGINT')
}

export function print (...args) {
  console.log(instance.__(...args))
}
