import app from './app.js'
import plugin from './plugin.js'
import project from './project.js'
import run from './run.js'
import misc from './misc.js'

/**
 * @module CLI/Command
 */

/**
 * Command definition object.
 *
 * @typedef TCommand
 * @type {object}
 * @property {string} command - Command syntax
 * @property {Array<string>} aliases - Command aliases
 * @property {string} describe - Command description
 * @property {function} builder - Function to build command options
 * @property {function} handler - Function to handle the command execution
 */

export const commands = [run, app, plugin, project, misc]
