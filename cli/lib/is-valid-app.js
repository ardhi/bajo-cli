import { isValid } from './is-valid-plugin.js'

function isValidApp (file) {
  return isValid(file, 'app')
}

export default isValidApp
