import fs from 'fs-extra'

async function modifyReadme ({ cwd, argv }) {
  const file = `${cwd}/README.md`
  let content = fs.readFileSync(file, 'utf8')
  content = content.replaceAll('{name}', argv.name)
  fs.writeFileSync(file, content, 'utf8')
}

export default modifyReadme
