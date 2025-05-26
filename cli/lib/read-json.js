import { isPlainObject, isEmpty } from 'lodash-es'
import fs from 'fs'

function readJson (file, thrownNotFound = false) {
  if (isPlainObject(thrownNotFound)) thrownNotFound = false
  if (!fs.existsSync(file) && thrownNotFound) throw this.error('notFound%s%s', this.print.write('file'), file)
  let resp
  try {
    resp = fs.readFileSync(file, 'utf8')
  } catch (err) {}
  if (isEmpty(resp)) return resp
  return JSON.parse(resp)
}

export default readJson
