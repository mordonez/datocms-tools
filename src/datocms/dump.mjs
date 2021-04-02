import fs from 'fs'
import https from 'https'
import path from 'path'
import { Transform } from 'stream'

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
