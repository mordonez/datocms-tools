import dump from '../src/datocms/dump.mjs'

const datocms_api_key = process.env.DATOCMS_API_KEY

dump(datocms_api_key)
