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
  return await client.uploads.all({} , { allPages: true })
}

const dump = async datocms_api_key => {
  const client = new SiteClient(datocms_api_key)
  const items = await allItems(client)
  fs.writeFileSync('items.json', JSON.stringify(items))
  const site = await siteInfo(client)
  fs.writeFileSync('site.json', JSON.stringify(site))
  const uploads = await allUploads(client)
  fs.writeFileSync('uploads.json', JSON.stringify(uploads))
}

export default dump
