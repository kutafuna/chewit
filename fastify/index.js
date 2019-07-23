"use strict";



//  P A C K A G E S

const color = require("colorette");
const fp = require("fastify-plugin");

//  U T I L S

const agent = require("../lib/ua");
const chew = require("..");
const extensionRegex = /\.[a-zA-Z0-9]+$/g;



//  E X P O R T

module.exports = exports = fp((fastify, options, next) => {
  if (!options.id) {
    next(new Error(
      color.red("\n\n▸▸ Chew Error\n") +
      color.magenta("▸▸▸ Missing Chew ID\n\n") +
      color.cyan(`Check ${color.underline("https://chew.sh/docs")} for integration tips\n`)
    ));
  }

  fastify.decorate("chew", { id: options.id });

  fastify.addHook("preHandler", (requestObject, reply, next) => {
    const logVisit = {};
    const url = requestObject.raw.url.match(extensionRegex);

    if (!url) {
      logVisit.id = fastify.chew.id;
      logVisit.timestamp = Date.now();

      if (
        requestObject.headers &&
        requestObject.headers.host
      ) logVisit.host = requestObject.headers.host;
      else logVisit.host = "";

      if (
        requestObject.raw &&
        requestObject.raw.hostname
      ) logVisit.hostname = requestObject.raw.hostname;
      else logVisit.hostname = "";

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
        requestObject.raw &&
        (requestObject.raw.url || requestObject.raw) &&
        requestObject.raw.originalUrl
      ) logVisit.url = requestObject.raw.url || requestObject.raw.originalUrl;
      else logVisit.url = "/";

      if (
        requestObject.raw &&
        requestObject.raw.method
      ) logVisit.httpMethod = requestObject.raw.method;
      else logVisit.httpMethod = "GET";

      if (
        requestObject.raw &&
        requestObject.raw.ip
      ) logVisit.ip = requestObject.raw.ip;
      else logVisit.ip = "";

      // TODO: Unable to get protocol i.e. `https?`
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
    }

    next();
  });

  next();
});
