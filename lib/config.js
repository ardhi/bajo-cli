/**
 * Configuration object.
 *
 * @typedef {Object} TConfig
 * @memberof BajoCli
 * @type {Object}
 * @property {object} [applet={}] - Applet configuration object
 * @property {boolean} [applet.save=false] - Whether to save the output of an applet to a file or not. Default: false
 */
const config = {
  applet: {
    save: false
  }
}

export default config
