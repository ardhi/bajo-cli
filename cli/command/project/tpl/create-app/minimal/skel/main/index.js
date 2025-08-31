async function factory (pkgName) {
  const me = this

  return class Main extends this.app.pluginClass.base {
    constructor () {
      super(pkgName, me.app)
      this.config = {
      }
    }

    init = async () => {
    }

    start = async () => {
    }

    exit = async () => {
    }
  }
}

export default factory
