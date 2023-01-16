import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
const readFileContent = util.promisify(fs.readFile)
const writeFileContent = util.promisify(fs.writeFile)

const CONTENTSPATHS = {
  DB_URL: './db/',
  ASSETS_URL: './assets/static/'
}
async function writeFile(jsonFile, data, wich) {
  const PATH = generatePath(jsonFile, wich)
  writeFileContent(PATH, JSON.stringify(data, null, 2), 'utf-8')
}

async function readFile(jsonFile, wich) {
  const PATH = generatePath(jsonFile, wich)
  let LIST = []
  LIST = readFileContent(PATH, 'utf-8').then(JSON.parse)
  return LIST
}
export const suma = () => 2 + 2

function generatePath(jsonFile, wich) {
  return path.join(process.cwd(), CONTENTSPATHS[wich], jsonFile)
}

export { writeFile, readFile }
