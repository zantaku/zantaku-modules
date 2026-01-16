#!/usr/bin/env node
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const c = {
	cyan: (s) => `\x1b[36m${s}\x1b[0m`,
	green: (s) => `\x1b[32m${s}\x1b[0m`,
	red: (s) => `\x1b[31m${s}\x1b[0m`,
	dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

const cwd = process.cwd();
const srcDir = path.join(cwd, "src");

if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
	console.error(c.red("✗  Missing required src/ directory"));
	process.exit(1);
}

const jsonFiles = fs
	.readdirSync(cwd)
	.filter(f => /^[a-z0-9_-]+\.json$/.test(f));

if (jsonFiles.length !== 1) {
	console.error(
		c.red("✗  Project must contain exactly one lowercase *.json file (e.g. source.json)")
	);
	process.exit(1);
}

const projectName = path.basename(cwd);


const start = Date.now();

console.log(c.cyan(`➜  Building module ${projectName}...`));

esbuild
	.build({
		entryPoints: ["src/index.js"],
		bundle: true,

		minify: true,
		minifyIdentifiers: true,
		minifySyntax: true,
		minifyWhitespace: true,
		treeShaking: true,

		format: "iife",
		globalName: "_",
		charset: "ascii",
		legalComments: "none",

		outfile: `${projectName}.js`,
		footer: {
			js: "Object.assign(globalThis,_)",
		},
	})
	.then(() => {
		const time = Date.now() - start;
		console.log(c.green(`✓  Built in ${time}ms`));
	})
	.catch((err) => {
		console.error(c.red("✗  Build failed"));
		console.error(err);
		process.exit(1);
	});
