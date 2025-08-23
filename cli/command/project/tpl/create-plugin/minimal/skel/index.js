async function factory (pkgName) {
  const me = this

  return class {name} extends this.lib.Plugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = '{alias}'
      this.dependencies = []
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
