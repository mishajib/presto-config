const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");

dotenv.config({ path: "./config.env" });

// Start the server
const PORT = process.env.APP_PORT || 5000;
http.createServer(app).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
