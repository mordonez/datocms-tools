import { downloadUploads } from '../src/datocms/dump.mjs'

const downloadPath = process.argv[2]
const datocms_api_key = process.env.DATOCMS_API_KEY
const overwriteExisting = 'OVERWRITE_EXISTING' in process.env
const verbose = 'VERBOSE' in process.env

if (!downloadPath) {
  raise `Supply a download path`
}

const options = { overwriteExisting, verbose }

downloadUploads(datocms_api_key, downloadPath, options)
