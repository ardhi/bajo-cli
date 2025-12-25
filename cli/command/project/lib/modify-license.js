import fs from 'fs-extra'

async function modifyLicense ({ cwd, pkg }) {
  const file = `${cwd}/LICENSE.md`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{author}', pkg.author)
    .replaceAll('{year}', (new Date()).getFullYear())
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyLicense
