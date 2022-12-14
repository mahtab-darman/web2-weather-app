// define variables bay getting them from DOM

const app = document.querySelector('.weather-app');
const temp = app.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const countryOutput = document.querySelector('.country');
const regionOutput = document.querySelector('.region');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');


// Default city when page load
let cityInput = "Tehran";

// Add click event to each city in the panel
cities.forEach((city)=>{
    city.addEventListener('click', (e)=>{
        // change form default city to the clicked one
        cityInput = e.target.innerHTML;

        // function that fetches and displays all the data from the weather API
        fetchWeatherData();
    });
})

// Add submit event to the form
form.addEventListener('submit',(e)=>{
    // show alert if input field is empty
    if(search.value == ""){
        alert('please type a city name');
    }else{
        // change the city name
        cityInput = search.value;

        fetchWeatherData();

        // remove text from the input field
        search.value = '';

        // fadeout the app
        app.style.opacity = "0";
    }

    // prevents the default behavior of the form
    e.preventDefault();
});

// function date returns a day of the week (saturday,sunday,...) from a data (12 03 2022)
function dayOfTheWeek(day,month,year) {
    const weekday = [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

// function that fetches and displays all the data from the weather API
function fetchWeatherData(){
    fetch(`http://api.weatherapi.com/v1/current.json?key=f62a92a395894e3fb13200803221412&q=${cityInput}`)

    // take te data (which is in jason format) amd covert it to a regular js object
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // adding the temperature and the weather condition the the page
        temp.innerHTML = data.current.temp_c +'<span>&#176;</span>';
        conditionOutput.innerHTML = data.current.condition.text;

        // get date and time from the city and extract the day, month , year and time into individual variables
        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(9,2));
        const time = date.substr(11);



        dateOutput.innerHTML = `${dayOfTheWeek(d,m,y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;
        //  add the name of the city into the page
        nameOutput.innerHTML = data.location.name;
        countryOutput.innerHTML = data.location.country;
        regionOutput.innerHTML = data.location.region;
        // get the corresponding icon url for the weather and extract a part of it
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        icon.src = "./icons/" + iconId;

        // add weather details tp the page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // set default time of the day
        let timeOfDAy = "day";
        //  get get the unique id for each weather condition
        const code = data.current.condition.code;

        // change to night if its night time in the city
        if (!data.current.is_day){
            timeOfDAy = "night";
        }

        if (code === 1000){
            // set the background image to clear
            app.style.backgroundImage = `url("./images/${timeOfDAy}/clear.jpg")`;
            // change the button color depending on if its day or night
            btn.style.background = "#e5ba92"
            if(timeOfDAy == "night"){
                btn.style.background = "#181e27";
            }
        }
        // same action for cloudy weather
        else if(
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
            ){
            app.style.backgroundImage =  `url("./images/${timeOfDAy}/cloudy.jpg")`;
            btn.style.background = "#fa6d1b"
            if(timeOfDAy == "night"){
                btn.style.background = "#181e27";
            }
        // rainy weather
        }else if(
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ){
            app.style.backgroundImage =  `url("./images/${timeOfDAy}/rainy.jpg")`;
            btn.style.background = "#647d75"
            if(timeOfDAy == "night"){
                btn.style.background = "#325c80";
            }  
        // snowy weather 
        }else{
            app.style.backgroundImage =` url("./images/${timeOfDAy}/snowy.jpg")`;
            btn.style.background = "#4d72aa";
            if(timeOfDAy == "night"){
                btn.style.background = "#1b1b1b";
            } 
        }

        // fade in the page  all is done
        app.style.opacity = "1";
    })
    // if the user types a city that doesn't exist, throw an alert
    .catch(() =>{
        alert("City not found, Please try again");
        app.style.opacity = "1";
    });
}

// call the function on page load
fetchWeatherData();

// fade in the page
app.style.opacity = "1";