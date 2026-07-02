import createApp from './create-app.js'
import createPlugin from './create-plugin.js'
import appToPlugin from './app-to-plugin.js'
import templates from './templates.js'

/**
 * @module CLI/Command/Project
 */

/**
 * Command definition object.
 *
 * @typedef TCommand
 * @type {object}
 * @global
 * @property {string} command - Command syntax
 * @property {Array<string>} aliases - Command aliases
 * @property {string} describe - Command description
 * @property {function} builder - Function to build command options
 * @property {function} handler - Function to handle the command execution
 */

export const commands = [createApp, createPlugin, appToPlugin, templates]
