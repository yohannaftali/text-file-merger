# text-file-merger

A small desktop app that merges all `.txt`, `.csv` or `.tsv` files in a folder into a single file. Built with [Electron](https://www.electronjs.org/).

## Features

- Merge every file with the chosen extension in a folder into one `result.<ext>` file
- Choose the file extension (txt, csv, tsv) in Settings
- Light and dark theme that follows your system setting
- Builds for Windows, Linux and macOS

## Download

Prebuilt packages for Windows, Linux and macOS are on the [Releases](https://github.com/yohannaftali/text-file-merger/releases) page. Download the zip for your platform, extract it, and run `text-file-merger`.

## How to Use

1. Open the app and click the settings icon to pick the file extension to merge (default: `txt`).
2. Click **Select Folder…** and choose the folder that contains your files.
3. The files are merged into `result.<ext>` in the same folder.

> **Warning:** an existing `result.<ext>` file in the selected folder is overwritten.

Your settings are saved in `setting-config.json` in your home folder.

## Run from Source

You need [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download/) (which includes npm).

```bash
# Clone this repository
git clone https://github.com/yohannaftali/text-file-merger
# Go into the repository
cd text-file-merger
# Install dependencies
npm install
# Run the app
npm start
```

## Build

Package the app for your current platform into the `dist` folder:

```bash
npx @electron/packager . text-file-merger --out=dist --overwrite
```

## Release

Releases are built automatically by GitHub Actions (`.github/workflows/release.yml`). Pushing a version tag builds Windows, Linux and macOS packages and attaches them to a new GitHub release:

```bash
git tag v1.0.2
git push origin v1.0.2
```

## Credits

- Icons: [Material Icons](https://fonts.google.com/icons) by Google, licensed under [Apache 2.0](app/font/MaterialIcons/LICENSE)

## License

[MIT](LICENSE)
