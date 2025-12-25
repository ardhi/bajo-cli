import { __ } from './translate.js'

export function onlyUnmatch (yargs, describe, alias) {
  yargs.option('only-unmatch', {
    describe: __(describe ?? 'Only unmatch versions'),
    alias: alias ?? 'u',
    type: 'boolean'
  })
}

export function registry (yargs, describe, alias) {
  yargs.option('registry', {
    describe: __(describe ?? 'Custom NPM registry, if any'),
    alias: alias ?? 'r',
    type: 'string'
  })
}

export function npmVersion (yargs, describe, alias) {
  yargs.option('npm-version', {
    describe: __(describe ?? 'Check last version on NPM'),
    alias: alias ?? 'n',
    type: 'boolean'
  })
}

export function globalScope (yargs, describe, alias) {
  yargs.option('global', {
    describe: __(describe ?? 'Global scope'),
    alias: alias ?? 'g',
    type: 'boolean'
  })
}

export function remote (yargs, describe, alias) {
  yargs.option('remote', {
    describe: __(describe ?? 'Force get remote package'),
    alias: alias ?? 'r',
    type: 'boolean'
  })
}

export function checkNpmName (yargs, describe, alias) {
  yargs.option('check-npm', {
    describe: __(describe ?? 'Check npm for name availability'),
    alias: alias ?? 'c',
    type: 'boolean'
  })
}

export function interactiveMode (yargs, describe, alias) {
  yargs.option('interactive', {
    describe: __(describe ?? 'Always in interactive mode'),
    alias: alias ?? 'i',
    type: 'boolean'
  })
}

export function useCwd (yargs, describe, alias) {
  yargs.option('use-cwd', {
    describe: __(describe ?? 'Use current working directory'),
    alias: alias ?? 'd',
    type: 'boolean'
  })
}

export function spawn (yargs, describe, alias) {
  yargs.option('spawn', {
    describe: __(describe ?? 'Spawn app as child process'),
    alias: alias ?? 's',
    default: true,
    type: 'boolean'
  })
}

export function applet (yargs, describe, alias) {
  yargs.option('applet', {
    describe: __(describe ?? 'Run applet instead of the main program'),
    alias: alias ?? 'a',
    type: 'string'
  })
}

export function posArgs (yargs, describe) {
  yargs.positional('args', {
    describe: __(describe ?? 'Optional one or more arguments')
  })
}

export function posName (yargs, describe) {
  yargs.positional('name', {
    describe: __(describe ?? 'Name'),
    type: 'string'
  })
}

export function posTpl (yargs, describe) {
  yargs.positional('tpl', {
    describe: __(describe ?? 'Template to use. Leave blank for interactive mode'),
    type: 'string'
  })
}

export function posTplType (yargs, describe) {
  yargs.positional('type', {
    describe: __(describe ?? 'Template type'),
    choices: ['app', 'plugin'],
    type: 'string'
  })
}
