const express = require('express');
const app = express();
const router = express.Router();
const path = require('path')
const request = require("request");
const config = require("./config.json");
const STATUS_URL = "https://discordapp.com/api/v6/users/@me/settings";
let discord = require('discord.js-selfbot-v11')
let client = new discord.Client()

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/index.js'));
});
app.use('/', router);
async function loop() {
	for (let anim of config.animation) {
		let res = await doRequest(anim.text, anim.emojiID, anim.emojiName).catch(console.error);
		if (!res) {
			// Die
			return;
		}

		await new Promise(p => setTimeout(p, anim.timeout));
	}

	loop();
}
console.log("Running...");
loop();

function doRequest(text, emojiID = null, emojiName = null) {
	return new Promise((resolve, reject) => {
		request({
			method: "PATCH",
			uri: STATUS_URL,
			headers: {
				Authorization: config.token
			},
			json: {
				custom_status: {
					text: text,
					emoji_id: emojiID,
					emoji_name: emojiName
				}
			}
		}, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}

			if (res.statusCode !== 200) {
				reject(new Error("Invalid Status Code: " + res.statusCode));
				return;
			}

			resolve(true);
		});
	});
}
client.on('ready', () => { 
   console.log(`Log in account name: ${client.user.username}`)
})
client.login('Njk0MjA2OTc4OTAxMjc4ODUw.GROonM.ibaprfanez6PLOjLAmMk1m5UyFwXRkfQrSjmSw');
let server = app.listen(3000, function(){
  console.log("App server is running on port 3000");
});