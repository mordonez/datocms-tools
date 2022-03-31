import fs from 'fs'
import https from 'https'
import path from 'path'
import { Transform } from 'stream'
import _  from 'lodash'

import DatoCMSClient from 'datocms-client'
const { SiteClient } = DatoCMSClient

const allItemTypes = async client => {
  return await client.itemTypes.all({});
}

const allFields = async client => {
  const itemTypes = await client.itemTypes.all({});
  const fields = await Promise.all(itemTypes.map(async (itemType) => client.fields.all(itemType.id)));
  return _.chain(fields).flatten().sortBy('position').value()
}

const allFieldsets = async client => {
  const itemTypes = await client.itemTypes.all({});
  const fieldsets = await Promise.all(itemTypes.map(async (itemType) => client.fieldsets.all(itemType.id)));
  return _.chain(fieldsets).flatten().sortBy('position').value()
}

const allItems = async client => {
  return await client.items.all({}, { allPages: true })
}

const allMenuItems = async client => {
  return await client.menuItems.all({})
}

const siteInfo = async client => {
  return await client.site.find()
}

const allUploads = async client => {
  return await client.uploads.all({} , { allPages: true })
}

const dump = async datocms_api_key => {
  const client = new SiteClient(datocms_api_key)
  const itemTypes = await allItemTypes(client)
  fs.writeFileSync('itemTypes.json', JSON.stringify(itemTypes))
  const fields = await allFields(client)
  fs.writeFileSync('fields.json', JSON.stringify(fields))
  const fieldsets = await allFieldsets(client)
  fs.writeFileSync('fieldsets.json', JSON.stringify(fieldsets))
  const items = await allItems(client)
  fs.writeFileSync('items.json', JSON.stringify(items))
  //const menu = await allMenuItems(client)
  //fs.writeFileSync('menuItems.json', JSON.stringify(menu))
  const site = await siteInfo(client)
  fs.writeFileSync('site.json', JSON.stringify(site))
  const uploads = await allUploads(client)
  fs.writeFileSync('uploads.json', JSON.stringify(uploads))
}

const downloadFilePromise = (url, destination) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {
      const data = new Transform()
      res.on('data', chunk => data.push(chunk))
      res.on('error', reject)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data.read())
        } else {
          reject(`Failed to download '${url}'. Status: ${res.statusCode}, ${body}`)
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

const downloadFile = async (url, destination) => {
  try {
    const content = await downloadFilePromise(url, destination)
    fs.writeFileSync(destination, content)
  } catch (error) {
    console.error(error)
  }
}

const downloadUploads = async (datocms_api_key, basePath, options = {}) => {
  const overwriteExisting = !!options.overwriteExisting
  const verbose = !!options.verbose
  if(!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath)
  }
  const client = new SiteClient(datocms_api_key)
  const uploads = await allUploads(client)
  for (const upload of uploads) {
    const { path: pathName, url } = upload
    const { dir } = path.parse(pathName)
    const downloadDirectory = path.join(basePath, dir)
    if(!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory)
    }
    const destination = path.join(basePath, pathName)
    if(!fs.existsSync(destination) || overwriteExisting) {
      if(verbose) {
        console.log(`Downloading '${url}' as '${destination}'`)
      }
      await downloadFile(url, destination)
    }
  }
}

export default dump
export { downloadUploads }
