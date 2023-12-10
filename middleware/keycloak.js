const Keycloak = require("keycloak-connect");
const dotenv = require('dotenv').config();

const config = {
  "realm": process.env.KEYCLOAK_REALM,
  "auth-server-url": `${process.env.KEYCLOAK_URL}/auth`,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_CLIENT,
  "bearer_only": true
}

const keycloak = new Keycloak({}, config);

module.exports = keycloak;