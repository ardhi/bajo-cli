import { input } from '@inquirer/prompts'
import semver from 'semver'
import { get, without, trim, map } from 'lodash-es'
import { __ } from '../../../lib/translate.js'
import boxen from 'boxen'

async function buildPackageJson ({ argv, session }) {
  const pkg = { name: argv.name, type: 'module' }
  pkg.version = await input({
    message: __('Version'),
    default: get(session, 'pkg.version', '0.0.1'),
    validate (text) {
      return semver.clean(text) ? true : __('Invalid version')
    }
  })
  pkg.description = await input({
    message: __('Description'),
    default: get(session, 'pkg.description')
  })
  const repo = await input({
    message: __('Git Repository'),
    default: get(session, 'pkg.repository.url')
  })
  const keywords = await input({
    message: __('Keywords'),
    default: get(session, 'pkg.keywords', []).join(' ')
  })
  pkg.author = await input({
    message: __('Author'),
    default: get(session, 'pkg.author')
  })
  pkg.license = await input({
    message: __('License'),
    default: get(session, 'pkg.license', 'MIT')
  })
  pkg.repository = {
    type: 'git',
    url: repo
  }
  pkg.keywords = without(map((keywords ?? '').replaceAll(',', ' ').split(' '), k => trim(k)), '', undefined, null)
  console.log(boxen(JSON.stringify(pkg, null, 2), { title: 'package.json', padding: 1, borderStyle: 'round' }))
  return pkg
}

export default buildPackageJson
