import rawlist from '@inquirer/rawlist'
import checkbox from '@inquirer/checkbox'
import _ from 'lodash'
import fs from 'fs-extra'
import listTpl from '../tpl/list-tpl.js'
import path from 'path'
import { __ } from '../../../lib/translate.js'

const plugins = [
  { value: 'bajo-config' },
  { value: 'bajo-emitter' },
  { value: 'bajo-logger' },
  { value: 'bajo-mqtt' },
  { value: 'bajo-serialport' },
  { value: 'bajo-sysinfo' },
  { value: 'bajo-web' }
]

async function customInstall ({ argv, type, session }) {
  const ext = {}
  const dirs = await listTpl(type)
  const choices = []
  for (const d of dirs) {
    const name = path.basename(d)
    let info
    try {
      info = fs.readFileSync(`${d}/info.txt`)
    } catch (err) {}
    choices.push({ value: name, name: `${name} - ${info}` })
  }
  const def = _.findIndex(choices, { value: _.get(session, 'ext.tpl') })
  ext.tpl = await rawlist({
    message: __(`Choose which %s template you want to use:`, type),
    default: def, // TODO: it doesn't work!
    choices
  })
  if (type === 'app') {
    let choices = [
      { value: 'local', name: __('Local, self contained project') },
      { value: 'global', name: __('Global, rely on bajo executable to start') },
      { value: 'hybrid', name: __('Hybrid, the best of both worlds') }
    ]
    const def = _.findIndex(choices, { value: _.get(session, 'ext.bootFile')})
    ext.bootFile = await rawlist({
      message: __('What kind of app do you want to create?'),
      default: def, // TODO: it doesn't work!
      choices
    })
    choices = _.map(_.cloneDeep(plugins), p => {
      p.checked = _.get(session, 'ext.plugins', []).includes(p.value)
      return p
    })
    ext.plugins = await checkbox({
      message: __('Choose which plugins should be included by default:'),
      default: _.get(session, 'ext.plugins', []),
      choices
    })

  } else if (type === 'plugin') {
    const choices = _.map(_.cloneDeep(plugins), p => {
      p.checked = _.get(session, 'ext.dependencies', []).includes(p.value)
      return p
    })
    ext.dependencies = await checkbox({
      message: __('Choose other plugins that your plugin dependent of:'),
      default: _.get(session, 'ext.dependencies', []),
      choices
    })
  }
  return ext
}

export default customInstall
