import fetch from 'node-fetch'

const npmUrl = 'https://registry.npmjs.com'

const getNpmPkgInfo = async (name) => {
  const resp = await fetch(`${npmUrl}/${encodeURIComponent(name)}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return resp
}

export default getNpmPkgInfo
