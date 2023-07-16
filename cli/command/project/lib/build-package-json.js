import { input } from '@inquirer/prompts'
import semver from 'semver'
import _ from 'lodash'
import { __ } from '../../../lib/translate.js'
import boxen from 'boxen'

async function buildPackageJson ({ argv, session }) {
  const pkg = { name: argv.name, type: 'module' }
  pkg.version = await input({
    message: __('Version'),
    default: _.get(session, 'pkg.version', '0.0.1'),
    validate (text) {
      return semver.clean(text) ? true : __('Invalid version')
    }
  })
  pkg.description = await input({
    message: __('Description'),
    default: _.get(session, 'pkg.description')
  })
  const repo = await input({
    message: __('Git Repository'),
    default: _.get(session, 'pkg.repository.url')
  })
  const keywords = await input({
    message: __('Keywords'),
    default: _.get(session, 'pkg.keywords', []).join(' ')
  })
  pkg.author = await input({
    message: __('Author'),
    default: _.get(session, 'pkg.author')
  })
  pkg.license = await input({
    message: __('License'),
    default: _.get(session, 'pkg.license', 'MIT')
  })
  pkg.repository = {
    type: 'git',
    url: repo
  }
  pkg.keywords = _.without(_.map((keywords || '').replaceAll(',', ' ').split(' '), k => _.trim(k)), '', undefined, null)
  console.log(boxen(JSON.stringify(pkg, null, 2), { title: 'package.json', padding: 1, borderStyle: 'round' }))
  return pkg
}

export default buildPackageJson