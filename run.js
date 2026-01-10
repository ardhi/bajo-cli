#!/usr/bin/env node
import { commands } from './cli/command/index.js'
import epilog from './cli/lib/epilog.js'
import yargs from 'yargs'
import { getLang, __ } from './cli/lib/translate.js'

const lang = getLang()

const y = yargs(process.argv.slice(2))
if (lang) y.locale(lang)

y.scriptName('bajo')
  .usage(__('Usage: $0 <command> [options]'))
  .version().alias('version', 'v')
  .command(commands)
  .demandCommand(1, __('Please provide your command'))
  .help().alias('help', 'h')
  .epilog(epilog)
  .strictCommands()
  .argv
