import { isPlainObject, isEmpty } from 'lodash-es'
import fs from 'fs'

function readJson (file, throwNotFound = false) {
  if (isPlainObject(throwNotFound)) throwNotFound = false
  if (!fs.existsSync(file) && throwNotFound) throw this.error('notFound%s%s', this.t('file'), file)
  let resp
  try {
    resp = fs.readFileSync(file, 'utf8')
  } catch (err) {}
  if (isEmpty(resp)) return resp
  return JSON.parse(resp)
}

export default readJson
