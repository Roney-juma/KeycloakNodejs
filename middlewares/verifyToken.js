const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    // Decode access token
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(" ");
    const tokenData = jwt.decode(token[1]);
    const refreshToken = req.headers.refresh_token
    var url= process.env.KEYCLOAK_AUTH_URL
      
    if (token.length !== 2) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    // Check token expiry
    if (tokenData.exp <= Math.floor(Date.now() / 1000)) {
      console.log("though imexpire")
      const newTokenResponse = await axios.post(url, {
        grant_type:'refresh_token',
        refresh_token: refreshToken,
        client_id:process.env.KEYCLOAK_CLIENT,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET
      });
      console.log("refreshToken",refreshToken)
      console.log("newAccessToken",newTokenResponse)

      const newAccessToken = newTokenResponse.data.access_token;
      tokenData = jwt.decode(newAccessToken);

      // Optional: Store the new access token in the request
      req.tokenData = newAccessToken;

      return res.status(401).json({ message: newAccessToken })
    }
    // Store decoded token data in request
    req.tokenData = tokenData;
    next();
  } catch (error) {
    next(error);
  }
}

const validateKeycloakToken = (token) => {
  try {
    // Replace 'YOUR_PUBLIC_KEY' with the actual public key from your Keycloak server
    const publicKey = 'YOUR_PUBLIC_KEY';

    // Verify the token using the public key
    const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    // Additional checks (optional): Check expiration, audience, issuer, etc.
    // Example: if (decodedToken.exp < Date.now() / 1000) throw new Error('Token expired');

    // Return the decoded token if everything is valid
    return decodedToken;
  } catch (error) {
    // Token validation failed
    throw new Error('Invalid token: ' + error.message);
  }
};