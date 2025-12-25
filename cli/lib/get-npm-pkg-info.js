import isEmpty from 'lodash-es/isEmpty.js'
import get from 'lodash-es/get.js'
import getAuthToken from 'registry-auth-token'
import npmFetch from 'npm-registry-fetch'

const npmUrl = 'https://registry.npmjs.com'

async function getNpmPkgInfo (name, registry) {
  if (isEmpty(registry)) registry = npmUrl
  const [, reg] = registry.split('//')
  const token = getAuthToken(`//${reg}`)
  const opts = { registry }
  if (!isEmpty(get(token, 'token'))) opts.forceAuth = { token: token.token }
  try {
    return await npmFetch.json(name, opts)
  } catch (err) {}
}

export default getNpmPkgInfo
