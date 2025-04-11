import express from "express";

export default class PatchesWeb {
	constructor(port = 3000) {
		const app = express();

		app.set("view engine", "ejs");

		app.use("/favicon.ico", express.static("media/favicon.ico"));
		app.use("/manifest.json", express.static("media/manifest.json"));

		app.use("/media", express.static("media"));
		app.use("/styles", express.static("styles"));

		app.use("/scripts", express.static("scripts"));

		app.use("/lib", express.static("lib"));

		app.use(
			"/scripts/antlr4.web.mjs",
			express.static("node_modules/antlr4/dist/antlr4.web.mjs"),
		);

		app.use("/scripts/patches.wasm", express.static("wasm/patches.wasm"));

		app.use("/syntax", express.static("syntax"));

		app.get("/", (req, res) => res.render("index"));

		app.all(/(.*)/, (_req, res) => res.sendStatus(404));

		app.listen(port);
	}
}

const port = Number(process.env.PORT ?? "3000");
const patchesWeb = new PatchesWeb(port);
