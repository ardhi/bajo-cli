import rawlist from '@inquirer/rawlist'
import checkbox from '@inquirer/checkbox'
import { findIndex, get, map, cloneDeep } from 'lodash-es'
import fs from 'fs-extra'
import listTpl from '../tpl/list-tpl.js'
import path from 'path'
import { __ } from '../../../lib/translate.js'

const plugins = [
  { value: 'bajo-extra' },
  { value: 'bajo-sysinfo' },
  { value: 'bajo-template' }
]

/**
 * Custom installation process for selecting templates and plugins.
 *
 * @async
 * @memberof module:CLI/Command/Project
 * @param {object} options - Parameters
 * @param {object} options.argv - Command line arguments
 * @param {string} options.type - Type of project (app or plugin)
 * @param {object} options.session - Session information
 * @returns {Promise<object>} - Selected options
 */
async function customInstall (options) {
  const { type, session } = options
  const ext = {}
  const dirs = await listTpl(type)
  let choices = []
  for (const d of dirs) {
    const name = path.basename(d)
    let info
    try {
      info = fs.readFileSync(`${d}/info.txt`)
    } catch (err) {}
    choices.push({ value: name, name: `${name} - ${info}` })
  }
  const def = findIndex(choices, { value: get(session, 'ext.tpl') })
  ext.tpl = await rawlist({
    message: __('Choose which %s template you want to use:', type),
    default: def, // TODO: it doesn't work!
    choices
  })
  if (type === 'app') {
    let choices = [
      { value: 'local', name: __('Local, self contained project') }
    ]
    const def = findIndex(choices, { value: get(session, 'ext.bootFile') })
    ext.bootFile = await rawlist({
      message: __('What kind of app do you want to create?'),
      default: def, // TODO: it doesn't work!
      choices
    })
    choices = map(cloneDeep(plugins), p => {
      p.checked = get(session, 'ext.plugins', []).includes(p.value)
      return p
    })
    ext.plugins = await checkbox({
      message: __('Choose which plugins should be included by default:'),
      default: get(session, 'ext.plugins', []),
      choices
    })
  }
  choices = map(cloneDeep(plugins), p => {
    p.checked = get(session, 'ext.plugins', []).includes(p.value)
    return p
  })
  const message = type === 'app' ? 'Choose which plugins should be included by default:' : 'Choose which plugins should be included as dependencies:'
  ext.plugins = await checkbox({
    message: __(message),
    default: get(session, 'ext.plugins', []),
    choices
  })

  return ext
}

export default customInstall
