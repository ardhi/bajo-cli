#!/usr/bin/env node

import { commands } from './command/index.js'
import epilog from './lib/epilog.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getLang, __ } from './lib/translate.js'
import getPkg from './lib/get-pkg.js'
import pkg from '../package.json' with { type: 'json' }

let version = false
const showHelp = process.argv.slice(2).length === 0
if (showHelp) {
  const info = await getPkg(`${process.cwd()}/node_modules/bajo/package.json`)
  const versions = [`${pkg.name}: ${pkg.version}`]
  const bajoPkg = await getPkg(`${process.cwd()}/node_modules/bajo/package.json`)
  if (bajoPkg) {
    versions.push(`bajo: ${bajoPkg.version}`)
  } else {
    const info = await getPkg(`${process.cwd()}/package.json`, 'plugin')
    if (info) {
      versions.push(`${info.name}: ${info.version}`)
    }
  }
  version = versions.join('\n')
}

yargs()
  .scriptName('bajo')
  .usage(__('Usage: $0 <command> [options]'))
  .version(version).alias('version', 'v')
  .command(commands)
  .demandCommand(1, __('Please provide your command'))
  .help(showHelp).alias('help', 'h')
  .epilog(epilog)
  .strictCommands()
  .locale(getLang())
  .parse(hideBin(process.argv))
