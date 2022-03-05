require("dotenv").config();
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {

    res.render("index", {
        imgUrl: "imgs/weather.png",
        Temp: 0,
        wind: 0,
        minTemp: 0,
        maxTemp: 0,
        pressure: 0,
        humidity: 0,
        desc: "",
        name: "Get Current weather Status.",
        day: ""
    });

})

app.post("/", function (req, res) {

    const queryCity = req.body.cityName;
    const apikey = process.env.APIKEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + queryCity + "&units=metric&appid=" + apikey;

    https.get(url, function (response) {

        response.on("data", function (data) {                   //response.on('data', ...) is how you register a listener for the data event and the data event is the primary way that you receive data from the incoming stream. This listener will be called one or more times with chunks of arriving data
            const weatherData = JSON.parse(data);
            // console.log(weatherData);

            if (weatherData.cod === 200) {
                const temp = weatherData.main.temp;
                const cityName = weatherData.name;
                const Pressure = weatherData.main.pressure;
                const Humidity = weatherData.main.humidity;
                const temp_min = weatherData.main.temp_min;
                const temp_max = weatherData.main.temp_max;
                const windSpeed = weatherData.wind.speed;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.render("index", {
                    imgUrl: iconURL,
                    Temp: temp,
                    wind: windSpeed,
                    minTemp: temp_min,
                    maxTemp: temp_max,
                    pressure: Pressure,
                    humidity: Humidity,
                    desc: weatherDescription,
                    name: cityName,
                    day: "Today"
                });
            } else {
                res.redirect("/")
            }

        })

    })
})


app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
})