const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1lZGV5YWQudjIwMjJAdml0c3R1ZGVudC5hYy5pbiIsImV4cCI6MTc3ODkzMDQyNSwiaWF0IjoxNzc4OTI5NTI1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODJiMjVlNzItMmNjZS00MGJjLThhYjgtMzk3MmYxODk2OTA0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwic3ViIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIn0sImVtYWlsIjoibW9oYW1tZWRleWFkLnYyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwicm9sbE5vIjoiMjJtaXMwMjg3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIiwiY2xpZW50U2VjcmV0IjoiQ1J1U0dObkp5bUh2UXJtRCJ9.WS07FsQxM_rV9MDJEVVf95zBQ9JASBym8nxqqd9-1bo";

async function Log(stack, level, packageName, message) {

    const body = {
        stack,
        level,
        package: packageName,
        message
    };

    try {

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            body,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        console.log(response.data);

    } catch (error) {
        console.log(error.message);
    }
}

app.get("/", async (req, res) => {

    await Log(
        "backend",
        "info",
        "handler",
        "home route accessed"
    );

    res.json({
        message: "Logging Middleware Working"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
