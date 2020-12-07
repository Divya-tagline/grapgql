const express = require("express");
const { createServer } = require("http");
// const { PubSub } = require("apollo-server");
// const { ApolloServer, gql } = require("apollo-server-express");
// const scema = require('./scema');

const app = express();

function convertHex(hex) {
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  if (r < 100) {
    r = "0" + r;
    if (r < 10) {
      r = "0" + r;
    }
  }

  if (g < 100) {
    g = "0" + g;
    if (g < 10) {
      g = "0" + g;
    }
  }

  if (b < 100) {
    b = "0" + b;
    if (b < 10) {
      b = "0" + b;
    }
  }

  result = {
    r: r,
    g: g,
    b: b,
  };
  return result;
}
var result = convertHex("#008080");
const httpServer = createServer(app);
// server.installSubscriptionHandlers(httpServer);
console.log("result", result);
httpServer.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
