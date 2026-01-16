#!/usr/bin/env node

const c = {
	cyan: s => `\x1b[36m${s}\x1b[0m`,
	green: s => `\x1b[32m${s}\x1b[0m`,
	red: s => `\x1b[31m${s}\x1b[0m`,
	dim: s => `\x1b[2m${s}\x1b[0m`,
};

const [, , cmd, flag] = process.argv;

const globalHelp = () => {
	console.log(c.cyan("zantaku-modules"));
	console.log("");
	console.log(c.dim("Usage:"));
	console.log("  zantaku-modules <command> [options]");
	console.log("");
	console.log(c.dim("Commands:"));
	console.log("  create            Create a new module from a template");
	console.log("  migrate <file.js> Migrate a legacy module into src/");
	console.log("  build             Bundle src/ into a compact module");
	console.log("");
	console.log(c.dim("Run:"));
	console.log("  zantaku-modules <command> --help");
	console.log("");
};

const createHelp = () => {
	console.log(c.cyan("zantaku-modules create"));
	console.log("");
	console.log(c.dim("Description:"));
	console.log("  Scaffold a new module using an interactive template.");
	console.log("");
	console.log(c.dim("Usage:"));
	console.log("  zantaku-modules create");
	console.log("");
};

const migrateHelp = () => {
	console.log(c.cyan("zantaku-modules migrate"));
	console.log("");
	console.log(c.dim("Description:"));
	console.log("  Convert a legacy module.js file into a modern src/ structure.");
	console.log("");
	console.log(c.dim("Usage:"));
	console.log("  zantaku-modules migrate <file.js>");
	console.log("");
	console.log(c.dim("Example:"));
	console.log("  zantaku-modules migrate old_module.js");
	console.log("");
};

const buildHelp = () => {
	console.log(c.cyan("zantaku-modules build"));
	console.log("");
	console.log(c.dim("Description:"));
	console.log("  Bundle the src/ directory into a compact production module.");
	console.log("");
	console.log(c.dim("Usage:"));
	console.log("  zantaku-modules build");
	console.log("");
};

if (!cmd || cmd === "--help" || cmd === "-h") {
	globalHelp();
	process.exit(0);
}

if (flag === "--help" || flag === "-h") {
	if (cmd === "create") return createHelp();
	if (cmd === "migrate") return migrateHelp();
	if (cmd === "build") return buildHelp();
	globalHelp();
	process.exit(0);
}

if (cmd === "create") {
	require("./commands/create");
} else if (cmd === "migrate") {
	require("./commands/migrate");
} else if (cmd === "build") {
	require("./commands/build");
} else {
	console.error(c.red(`✗  Unknown command: ${cmd}`));
	console.log(c.dim("Run: zantaku-modules --help"));
	process.exit(1);
}
