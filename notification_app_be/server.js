const express = require("express");
const axios = require("axios");

const app = express();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1lZGV5YWQudjIwMjJAdml0c3R1ZGVudC5hYy5pbiIsImV4cCI6MTc3ODkzMDAwNywiaWF0IjoxNzc4OTI5MTA3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzYxMWMzNjEtZjQ5Mi00YzYyLWIzYjQtMGMwYzRkOTY4MzE1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwic3ViIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIn0sImVtYWlsIjoibW9oYW1tZWRleWFkLnYyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwicm9sbE5vIjoiMjJtaXMwMjg3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIiwiY2xpZW50U2VjcmV0IjoiQ1J1U0dObkp5bUh2UXJtRCJ9.xPI-CDs130MkE-a7SPpi-tJT6VtQWZG3q_ltt6dhS3o";

async function getNotifications() {

    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/notifications",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.notifications;
}

app.get("/top-notifications", async (req, res) => {

    try {

        const notifications = await getNotifications();

        const priorityMap = {
            Placement: 3,
            Result: 2,
            Event: 1
        };

        notifications.sort((a, b) => {

            const priorityA = priorityMap[a.Type];
            const priorityB = priorityMap[b.Type];

            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }

            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const top10 = notifications.slice(0, 10);

        res.json(top10);

    } catch (error) {

        res.json({
            error: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Notification Service Running");
});
