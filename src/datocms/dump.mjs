import fs from 'fs'

import DatoCMSClient from 'datocms-client'
const { SiteClient } = DatoCMSClient

const allItems = async client => {
  return await client.items.all({}, { allPages: true })
}

const siteInfo = async client => {
  return await client.site.find()
}

const allUploads = async client => {
  return await client.uploads.all({})
}

const dump = async () => {
  const client = new SiteClient(process.env.DATOCMS_API_KEY)
  const items = await allItems(client)
  fs.writeFileSync('items.json', JSON.stringify(items))
  const site = siteInfo(client)
  fs.writeFileSync('site.json', JSON.stringify(site))
  const uploads = allUploads(client)
  fs.writeFileSync('uploads.json', JSON.stringify(uploads))
}

export default dump
