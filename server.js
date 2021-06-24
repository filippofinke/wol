require("dotenv").config();
const express = require("express");
const ping = require("ping");
const wol = require("wol");
const app = express();

const port = process.env.PORT || 80;
const password = process.env.PASSWORD;

const isDevelopment = process.env.NODE_ENV == "development";

if (!password) {
	console.log("❌ Please provide a PASSWORD in your .env file!");
	return;
}

const devices = require("./devices.js");

if (isDevelopment) {
	app.use((req, res, next) => {
		req.on("end", () => {
			console.log(`🔗 [${new Date().toLocaleString()}] ${req.url.padEnd(29)} ${res.statusCode}`);
		});
		next();
	});
}

app.use(express.static("build"));

app.use((req, res, next) => {
	if (req.headers.authorization == password) {
		return next();
	}
	return res.sendStatus(403);
});

app.post("/api/device/:mac", (req, res) => {
	wol
		.wake(req.params.mac)
		.then(() => {
			return res.send(200);
		})
		.catch((error) => {
			return res.status(500).send(error);
		});
});

app.get("/api/device/:mac", (req, res) => {
	let device = devices.find((d) => d.mac == req.params.mac);

	if (!device) {
		return res.sendStatus(404);
	}

	if (device.ip != "Unknown") {
		ping.promise
			.probe(device.ip, {
				timeout: 1,
			})
			.then((result) => {
				return res.send(result.alive ? "Online" : "Offline");
			});
	} else {
		return res.send("Unknown");
	}
});

app.get("/api/devices", (req, res) => {
	return res.json(devices);
});

app.listen(port, "0.0.0.0", () => {
	console.log(`🚀 wol-web listening on port: ${port}\n🚀 Mode: ${process.env.NODE_ENV}`);
});
