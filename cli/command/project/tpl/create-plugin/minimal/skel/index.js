async function factory (pkgName) {
  const me = this

  return class {name} extends this.app.baseClass.Base {
    constructor () {
      super(pkgName, me.app)
      this.config = {
      }
    }

    init = async () => {
    }

    start = async () => {
    }

    dispose = async () => {
    }
  }
}

export default factory
