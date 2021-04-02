# datocms-tools

Utilities for DatoCMS.

# `dump`

Dumps all project data as JSON files.

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} npm run dump
```

Creates the following:

* `items.json`
* `site.json`
* `uploads.json`

# `get-images`

Downloads all the project uploads to a local directory.

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} npm run get-images {{output path}}
```

If you want logging, pass the VERBOSE environment:

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} VERBOSE=1 npm run get-images {{output path}}
```

The download is progressive, so if files are already present,
they will not be re-downloaded.

If you *want* to forse re-download, supply the OVERWRITE_EXISTING environment:

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} OVERWRITE_EXISTING=1 npm run get-images {{output path}}
```
