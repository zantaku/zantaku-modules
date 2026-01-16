#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

const c = {
	cyan: s => `\x1b[36m${s}\x1b[0m`,
	green: s => `\x1b[32m${s}\x1b[0m`,
	red: s => `\x1b[31m${s}\x1b[0m`,
	dim: s => `\x1b[2m${s}\x1b[0m`,
};

const start = Date.now();
const input = process.argv[3];

if (!input) {
	console.error(c.red("✗  Usage: modules migrate <file.js>"));
	process.exit(1);
}

const filePath = path.resolve(process.cwd(), input);
if (!fs.existsSync(filePath)) {
	console.error(c.red(`✗  File not found: ${input}`));
	process.exit(1);
}

console.log(c.cyan(`➜  Migrating ${path.basename(input)}...`));

const API_FUNCS = new Set([
	"searchResults",
	"extractDetails",
	"extractEpisodes",
	"extractStreamUrl",
	"extractChapters",
	"extractImages",
]);

const cwd = process.cwd();
const srcDir = path.join(cwd, "src");
const utilDir = path.join(srcDir, "utils");

const code = fs.readFileSync(filePath, "utf8");

let ast;
try {
	ast = acorn.parse(code, {
		ecmaVersion: "latest",
		sourceType: "script",
	});
} catch (e) {
	console.error(c.red("✗  Failed to parse JS"));
	console.error(e.message);
	process.exit(1);
}

console.log(c.dim("• Parsed source file"));

fs.mkdirSync(utilDir, { recursive: true });

const apiExports = new Set();
const utilExports = new Set();

let migrated = 0;

for (const node of ast.body) {
	if (node.type !== "FunctionDeclaration") continue;

	const name = node.id?.name;
	if (!name) continue;

	if (apiExports.has(name) || utilExports.has(name)) {
		console.log(c.dim(`• Skipping duplicate ${name}`));
		continue;
	}

	const raw = code.slice(node.start, node.end);
	const exported = raw.startsWith("async function")
		? raw.replace("async function", "export async function")
		: raw.replace("function", "export function");

	const isApi = API_FUNCS.has(name);
	const outDir = isApi ? srcDir : utilDir;
	const outPath = path.join(outDir, `${name.toLowerCase()}.js`);

	fs.writeFileSync(outPath, exported + "\n");

	if (isApi) apiExports.add(name);
	else utilExports.add(name);

	migrated++;
}

if (!migrated) {
	console.error(c.red("✗  No functions migrated"));
	process.exit(1);
}

console.log(c.dim(`• Extracted ${migrated} functions`));

if (utilExports.size) {
	fs.writeFileSync(
		path.join(utilDir, "index.js"),
		[...utilExports]
			.map(n => `export { ${n} } from "./${n.toLowerCase()}.js";`)
			.join("\n") + "\n"
	);
}

fs.writeFileSync(
	path.join(srcDir, "index.js"),
	[
		...[...apiExports].map(
			n => `export { ${n} } from "./${n.toLowerCase()}.js";`
		),
		utilExports.size ? `export * from "./utils/index.js";` : "",
	].join("\n") + "\n"
);

const time = Date.now() - start;
console.log(c.green(`✓  Migration complete in ${time}ms`));
console.log(c.green(`✓  ${apiExports.size} API functions`));
console.log(c.green(`✓  ${utilExports.size} utils`));
