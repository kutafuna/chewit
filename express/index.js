"use strict";



//  P A C K A G E

const color = require("colorette");

//  U T I L S

const agent = require("../lib/ua");
const chew = require("..");



//  P R O G R A M

module.exports = exports = siteId => {
  if (!siteId) {
    return new Error(
      color.red("\n\n▸▸ Chew Error\n") +
      color.magenta("▸▸▸ Missing Chew ID\n\n") +
      color.cyan(`Check ${color.underline("https://chew.sh/docs")} for integration tips\n`)
    );
  }

  return (requestObject, responseObject, next) => {
    const logVisit = {};

    logVisit.id = siteId;
    logVisit.timestamp = Date.now();

    if (
      requestObject.headers &&
      requestObject.headers.host
    ) logVisit.host = requestObject.headers.host;
    else logVisit.host = "";

    if (requestObject.hostname)
      logVisit.hostname = requestObject.hostname;
    else
      logVisit.hostname = "";

    if (
      requestObject.headers &&
      requestObject.headers["accept-language"]
    ) logVisit.language = requestObject.headers["accept-language"];
    else logVisit.language = "en";

    if (
      requestObject.headers &&
      requestObject.headers.referer
    ) logVisit.referrer = requestObject.headers.referer;
    else logVisit.referrer = "";

    if (
      requestObject.headers.dnt &&
      parseInt(requestObject.headers.dnt)
    ) logVisit.dnt = parseInt(requestObject.headers.dnt);
    else logVisit.dnt = 1;

    if (
      requestObject.url ||
      requestObject.originalUrl ||
      requestObject.path
    ) logVisit.url = requestObject.url || requestObject.originalUrl || requestObject.path;
    else logVisit.url = "/";

    if (requestObject.method)
      logVisit.httpMethod = requestObject.method;
    else
      logVisit.httpMethod = "GET";

    if (
      requestObject.headers["x-forwarded-for"] ||
      requestObject.connection.remoteAddress ||
      requestObject.ip
    ) logVisit.ip = requestObject.headers["x-forwarded-for"] || requestObject.connection.remoteAddress || requestObject.ip;
    else logVisit.ip = "";

    if (requestObject.protocol)
      logVisit.protocol = requestObject.protocol;
    else
      logVisit.protocol = "http";

    // User Agent

    let source = requestObject.headers["user-agent"] || "";

    if (requestObject.headers["x-ucbrowser-ua"])
      source = requestObject.headers["x-ucbrowser-ua"];

    const ua = agent();

    ua.Agent.source = source.replace(/^\s*/, "").replace(/\s*$/, "");

    ua.Agent.browser = ua.getBrowser(ua.Agent.source);
    ua.Agent.browserversion = ua.getBrowserVersion(ua.Agent.source);
    ua.Agent.os = ua.getOS(ua.Agent.source);
    ua.Agent.osversion = ua.getOSVersion(ua.Agent.source);
    ua.Agent.platform = ua.getPlatform(ua.Agent.source);

    ua.testAndroidTablet();
    ua.testCaptiveNetwork();
    ua.testCompatibilityMode();
    ua.testDevice();
    ua.testTablet();
    ua.testBot();
    ua.testWebkit();

    logVisit.ua = ua.Agent;

    chew(logVisit.id, logVisit);
    next();
  };
};
