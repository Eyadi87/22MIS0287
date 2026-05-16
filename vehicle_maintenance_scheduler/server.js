const express = require("express");
const axios = require("axios");

const app = express();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1lZGV5YWQudjIwMjJAdml0c3R1ZGVudC5hYy5pbiIsImV4cCI6MTc3ODkyOTA3MiwiaWF0IjoxNzc4OTI4MTcyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGY1MGE4OWEtMjFkNy00Zjk2LTk3ZDQtOTQ0ZGExNjlmNDJmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwic3ViIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIn0sImVtYWlsIjoibW9oYW1tZWRleWFkLnYyMDIyQHZpdHN0dWRlbnQuYWMuaW4iLCJuYW1lIjoibW9oYW1tZWQgZXlhZCB2Iiwicm9sbE5vIjoiMjJtaXMwMjg3IiwiYWNjZXNzQ29kZSI6IlNmRnVXZyIsImNsaWVudElEIjoiMzM3OGFmNGYtZjA3NC00NWM3LWFhZmItMDk0YTZlNTk3ZTdiIiwiY2xpZW50U2VjcmV0IjoiQ1J1U0dObkp5bUh2UXJtRCJ9.U4XedECji2ZjiTfHbQ-XuXhnbs7WaM1gAST5C5y2Dms";

async function getDepots() {

    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/depots",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.depots;
}

async function getVehicles() {

    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/vehicles",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.vehicles;
}

function scheduleVehicles(vehicles, maxHours) {

    const n = vehicles.length;

    const dp = Array(n + 1)
        .fill()
        .map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {

        const duration = vehicles[i - 1].Duration;
        const impact = vehicles[i - 1].Impact;

        for (let w = 0; w <= maxHours; w++) {

            if (duration <= w) {

                dp[i][w] = Math.max(
                    impact + dp[i - 1][w - duration],
                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][maxHours];
}

app.get("/schedule", async (req, res) => {

    try {

        const depots = await getDepots();
        const vehicles = await getVehicles();

        const result = [];

        for (const depot of depots) {

            const bestImpact = scheduleVehicles(
                vehicles,
                depot.MechanicHours
            );

            result.push({
                depotID: depot.ID,
                mechanicHours: depot.MechanicHours,
                maximumImpact: bestImpact
            });
        }

        res.json(result);

    } catch (error) {

        res.json({
            error: error.message
        });
    }
});

app.listen(4000, () => {
    console.log("Vehicle Scheduler Running");
});