"use strict";



//  P A C K A G E S

const color = require("colorette");
const got = require("got");

//  U T I L

const apiUrl = "https://api.chew.sh";



//  P R O G R A M

module.exports = exports = (siteId, visitDetails) => {
  if (!siteId)
    return displayError("Your site cannot be tracked without an ID!");

  if (!visitDetails)
    return; // Gracefully decline to continue

  return new Promise(async(resolve) => {
    const { protocol } = new URL(visitDetails.hostname);

    switch(true) {
      case protocol.includes("localhost"):
      case protocol.includes(".local"):
        resolve(siteId); // Ignore local development
        return;

      default:
        try {
          const [visitEmitResponse] = await Promise.all([got.post(apiUrl, {
            body: visitDetails,
            json: true
          })]);

          if (!visitEmitResponse.body)
            resolve();
          else
            resolve(visitEmitResponse.body);
        } catch(visitEmitError) {
          resolve(displayError(visitEmitError));
        }

        return;
    }
  });
};



//  H E L P E R

const displayError = text => {
  if (text.toString().includes("40"))
    text = text.toString().split("-")[1].trim().replace(/"/g, "");

  if (text.toString().includes("50"))
    text = "Internal server error, please try once more in a few minutes.";

  if (text.toString().includes("socket hang up"))
    return;

  return process.stdout.write(
    color.red("\n▸▸ Chew Error\n") +
    color.magenta(`▸▸▸ ${text.toString().split(":")}\n\n`) +
    color.cyan(`Check ${color.underline("https://chew.sh/docs")} for integration tips\n`)
  );
};
