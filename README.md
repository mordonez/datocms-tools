# datocms-tools

Utilities for DatoCMS.

Install globally with npm:

```js
npm add -g datocms-tools
```

Install globally with yarn:

```js
yarn global add datocms-tools
```

# `datocms-dump`

Dumps all project data as JSON files.

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} datocms-dump
```

Creates the following:

* `itemTypes.json`
* `items.json`
* `site.json`
* `uploads.json`

# `datocms-get-uploads`

Downloads all the project uploads to a local directory.

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} datocms-get-uploads {{output path}}
```

If you want logging, pass the VERBOSE environment:

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} VERBOSE=1 datocms-get-uploads {{output path}}
```

The download is progressive, so if files are already present,
they will not be re-downloaded.

If you *want* to forse re-download, supply the OVERWRITE_EXISTING environment:

```js
$ DATOCMS_API_KEY={{your DatoCMS read-only API key}} OVERWRITE_EXISTING=1 datocms-get-uploads {{output path}}
```
