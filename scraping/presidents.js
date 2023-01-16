import fetch from 'node-fetch'

import { readFile, writeFile } from './utils.js'

const PATHS = {
  rawPresidents: 'raw-presidents.json',
  presindents: 'presidents.json',
  staticPresidents: 'presidents'
}

const RAW_PRESIDENTS = await readFile(PATHS.rawPresidents, 'DB_URL')

const promises = RAW_PRESIDENTS.map(async (rp) => {
  const { slug: id, title, _links: links } = rp
  const { rendered: name } = title
  const { 'wp:attachment': attachment } = links
  const { href: imageApiEndpointUrl } = attachment[0]

  const [imageInfo] = await fetch(imageApiEndpointUrl).then((r) => r.json())
  const {
    guid: { rendered: imageUrl }
  } = imageInfo

  const ext = imageUrl.split('.').at(-1)
  const responseImage = await fetch(imageUrl)
  const arrayBuffer = await responseImage.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const imageFileName = `${id}.${ext}`
  await writeFile(
    `${PATHS.staticPresidents}/${imageFileName}`,
    buffer,
    'ASSETS_URL'
  )

  return { id, name, image: imageFileName, teamId: 0 }
})
const results = await Promise.all(promises)
await writeFile(PATHS.presindents, results, 'DB_URL')
