const app = require("./app");
const http = require('http');
const server = http.createServer(app);

// server.listen(PORT, (error) => {
//     if (error) {
//         console.log('Error starting the server');
//     }
//     console.log(`Server is running on http://localhost:${PORT}`);
// }
// );
// ;