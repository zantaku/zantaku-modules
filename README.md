# zantaku-modules

A modern rewrite of 50n50’s module system with a cleaner structure, interactive scaffolding, and a streamlined bundling pipeline.

This tool is designed to help you create, migrate, and build JavaScript-based content modules using a modular source layout that compiles into a single compact output file.


## Features

- Interactive project scaffolding with templates
- Supports video and reading sources (anime, movies, shows, manga, novels)
- Automatic module.json generation
- Migration tool for legacy or compacted modules
- Fast bundling and minification using esbuild
- Zero framework lock-in (plain JavaScript)
- Works with Node.js, React Native, and browser runtimes


## Installation

Install globally:

```bash
npm install -g zantaku-modules
````


## Commands

### Create a new module

```bash
zantaku-modules create
```

Launches an interactive CLI that scaffolds a new module project and generates the required configuration files.


### Migrate an existing module

```bash
zantaku-modules migrate <file.js>
```

Takes an existing compacted or legacy module file and converts it into a modular `src/` structure with individual function files and utilities.


### Build a module

```bash
zantaku-modules build
```

Bundles the `src/` directory into a single optimized output file using esbuild.


## Project Structure

```
project/
├─ src/
│  ├─ index.js
│  ├─ searchResults.js
│  ├─ extractDetails.js
│  ├─ extractEpisodes.js    // For video modules
│  ├─ extractStreamUrl.js   // For video modules
│  ├─ extractDetails.js     // For reading modules
│  ├─ extractImages.js      // For reading modules
│  └─ utils/
│     ├─ index.js
│     └─ *.js
├─ <project-name>.json
└─ <project-name>.js
```


## Requirements

* Node.js 18 or newer
* npm 9 or newer


## License

MIT
