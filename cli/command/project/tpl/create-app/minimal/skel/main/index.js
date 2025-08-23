async function factory (pkgName) {
  const me = this

  return class Main extends this.lib.Plugin {
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
