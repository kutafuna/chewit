"use strict";



//  P A C K A G E S

const color = require("colorette");
const request = require("request-promise-native");



//  P R O G R A M

module.exports = exports = (siteId, visitDetails) => {
  if (!siteId) return displayError("Your site cannot be tracked without an ID!");
  if (!visitDetails) return; // Gracefully decline to continue

  return new Promise((resolve, reject) => { // eslint-disable-line
    if (!visitDetails.hostname.includes("localhost")) { // ignore local development
      request({
        body: visitDetails,
        json: true,
        method: "POST",
        url: "https://api.chew.sh"
      }).then(visitEmitResponse => {
        if (!visitEmitResponse) resolve(visitEmitResponse);
        resolve(visitEmitResponse);
      }).catch(visitEmitError => {
        resolve(displayError(visitEmitError));
      });
    } else {
      resolve(siteId);
    }
  });
};



//  H E L P E R

const displayError = text => {
  if (text.toString().includes("40"))
    text = text.toString().split("-")[1].trim().replace(/"/g, "");

  if (text.toString().includes("50"))
    text = "Internal server error, please try once more in a few minutes.";

  if (text.toString().includes("socket hang up")) return;

  return process.stdout.write(
    color.red("\n▸▸ Chew Error\n") +
    color.magenta(`▸▸▸ ${text.toString().split(":")}\n\n`) +
    color.cyan(`Check ${color.underline("https://chew.sh/docs")} for integration tips\n`)
  );
};
