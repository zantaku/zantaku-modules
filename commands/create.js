#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const prompts = require("prompts");

(async () => {
	const templatesDir = path.join(__dirname, "../templates");

	// Safety check
	if (!fs.existsSync(templatesDir)) {
		console.error("Templates directory not found");
		process.exit(1);
	}

	const response = await prompts([
		{
			type: "text",
			name: "projectName",
			message: "Project name",
			format: (v) => v.toLowerCase().replace(/\s+/g, ""),
			validate: (v) =>
				/^[a-z0-9_-]+$/.test(v)
					? true
					: "Only lowercase letters, numbers, _ or - allowed",
		},

		{
			type: "select",
			name: "template",
			message: "Select a template",
			choices: fs.readdirSync(templatesDir).map((t) => ({
				title: t,
				value: t,
			})),
		},

		{
			type: "text",
			name: "sourceName",
			message: "Source name",
			validate: (v) => (v ? true : "Source name is required"),
		},

		{
			type: "text",
			name: "description",
			message: "Description (optional)",
		},

		{
			type: "text",
			name: "iconUrl",
			message: "Module icon URL",
			validate: (v) => (v ? true : "Icon URL is required"),
		},

		{
			type: "text",
			name: "authorName",
			message: "Author name",
			validate: (v) => (v ? true : "Author name is required"),
		},

		{
			type: "text",
			name: "authorIcon",
			message: "Author icon URL",
			validate: (v) => (v ? true : "Author icon URL is required"),
		},

		{
			type: "text",
			name: "authorUrl",
			message: "Author profile URL (optional)",
		},

		{
			type: "select",
			name: "contentGroup",
			message: "Content category",
			choices: [
				{ title: "Video (Anime / Movies / Shows)", value: "video" },
				{ title: "Reading (Manga / Novels)", value: "reading" }
			]
		},

		{
			type: prev => prev === "video" ? "multiselect" : null,
			name: "type",
			message: "Select video types",
			choices: [
				{ title: "Anime", value: "anime" },
				{ title: "Movies", value: "movies" },
				{ title: "Shows", value: "shows" }
			]
		},
		
		{
			type: prev => prev === "reading" ? "multiselect" : null,
			name: "type",
			message: "Select reading types",
			choices: [
				{ title: "Manga", value: "manga" },
				{ title: "Novels", value: "novels" }
			]
		},

		{
			type: (_, values) =>
				Array.isArray(values.type) &&
				values.type.some(t =>
					["anime", "movies", "shows"].includes(t)
				)
					? "select"
					: null,
			name: "streamType",
			message: "Stream type",
			choices: [
				{ title: "HLS", value: "HLS" },
				{ title: "MP4", value: "MP4" },
			],
		},
		{
			type: (_, values) =>
				Array.isArray(values.type) &&
				values.type.some(t =>
					["anime", "movies", "shows"].includes(t)
				)
					? "select"
					: null,
			name: "quality",
			message: "Default quality",
			choices: [
				{ title: "360p", value: "360p" },
				{ title: "720p", value: "720p" },
				{ title: "1080p", value: "1080p" },
				{ title: "2K (1440p)", value: "1440p" },
				{ title: "4K (2160p)", value: "4k" },
			],
		},

		{
			type: "text",
			name: "baseUrl",
			message: "Base URL",
			validate: (v) => (v ? true : "Base URL is required"),
		},

		{
			type: "text",
			name: "searchBaseUrl",
			message: "Search URL (must include %s)",
			validate: (v) =>
				v.includes("%s") ? true : "Search URL must include %s",
		},

		{
			type: "text",
			name: "scriptUrl",
			message: "Script URL",
			validate: (v) => (v ? true : "Script URL is required"),
		},

		{
			type: "confirm",
			name: "downloadSupport",
			message: "Download support?",
			initial: false,
		},

		{
			type: "confirm",
			name: "asyncJS",
			message: "Load script asynchronously?",
			initial: true,
		},

		{
			type: (_, values) =>
				Array.isArray(values.type) &&
				values.type.some(t =>
				["anime", "movies", "shows"].includes(t)
				)
				? "confirm"
				: null,
			name: "streamAsyncJS",
			message: "Stream async only?",
			initial: false,
		},

		{
			type: (_, values) =>
				Array.isArray(values.type) &&
				values.type.some(t =>
				["anime", "movies", "shows"].includes(t)
				)
				? "confirm"
				: null,
			name: "softsub",
			message: "Soft subtitles?",
			initial: true,
		},


		{
			type: "confirm",
			name: "combo",
			message: "Multiple sources in one module?",
			initial: false,
		},
	]);

	if (!response.template) process.exit(0);

	const dest = path.join(process.cwd(), response.projectName);
	const src = path.join(templatesDir, response.template);

	if (fs.existsSync(dest)) {
		console.error("Directory already exists:", dest);
		process.exit(1);
	}

	fs.copySync(src, dest);

	const moduleJson = {
		sourceName: response.sourceName,
		description: response.description || undefined,
		iconUrl: response.iconUrl,

		author: {
			name: response.authorName,
			icon: response.authorIcon,
			url: response.authorUrl || undefined,
		},

		version: 1,
		language: "English",

		baseUrl: response.baseUrl,
		searchBaseUrl: response.searchBaseUrl,
		scriptUrl: response.scriptUrl,

		streamType: response.streamType,
		quality: response.quality,
		type: response.type.join("/"),

		downloadSupport: response.downloadSupport,
		asyncJS: response.asyncJS,
		streamAsyncJS: response.streamAsyncJS,
		softsub: response.softsub,
		combo: response.combo,
	};

	fs.writeJsonSync(
		path.join(dest, `${response.projectName}.json`),
		moduleJson,
		{ spaces: 4 }
	);

	console.log(`✔ Module '${response.projectName}' created successfully`);
})();
