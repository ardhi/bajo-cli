const npmUrl = 'https://registry.npmjs.com'

async function getNpmPkgInfo (name) {
  const resp = await fetch(`${npmUrl}/${encodeURIComponent(name)}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return resp
}

export default getNpmPkgInfo
