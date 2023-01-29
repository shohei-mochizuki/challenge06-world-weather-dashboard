let apiKey = "91968567ff99e1beb7a3cbfb1666acb9";
let searchBtn = document.getElementById("searchBtn");
let searchedCities = {};
let historySection = document.getElementById("historySection");
let cBtn = document.getElementById("cBtn");
let fBtn = document.getElementById("fBtn");


// Initial actions to be taken when the page is loaded
function init(){
  displayHistory();
}

// Get the city name that is inputin the search section and pass it to the functions "getWeatherData"
function getInputCity(event){
  event.preventDefault();
  let selectedCity = document.getElementById("city-input").value;
  if (selectedCity===""){ // If the input is blank, show the alert message below and stop the executions
    window.alert("Please type a city name in the search input box");
    return;
  }
  getCurrentWeatherData(selectedCity); // Fetch current weather data
  getForecastWeatherData(selectedCity); // Fetch 5-day forecast weather data
}

// Get the city name that is clicked and pass it to the functions "getWeatherData"
function getClickedCity(event){
  event.preventDefault();
  let selectedCity = event.target.value;
  getCurrentWeatherData(selectedCity); // Fetch current weather data
  getForecastWeatherData(selectedCity); // Fetch 5-day forecast weather data
}

// Fetch current weather data from OpenWeather server
function getCurrentWeatherData(city){
  let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; 
  fetch(requestUrl)
  .then(function (response) {
    if (response.ok===false) { // When there's an error, show the alert message below and do not continue subsequent executions
    alert("Please check the city name again. It may be incorrect.");
    return;
    } else {
      return response.json();
    } 
  })
  .then(function (data) {
    showCurrentWeatherData(data); // Show weather information (values)
    saveSearch(data); // Save this new city name in Local Storage
    displayResultSection(); // Show weather information section (right side of the window) in case it's not shown
    displayDates(data); // Show dates of today and 5 following days
    displayHistory(); // Refresh (or create) search history section and list the city names that have been searched
    resetCF(); // Reset the temperature unit settings to °C
  });
}

// Fetch 5-day forecast weather data from OpenWeather server
function getForecastWeatherData(city){
  let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; 
  fetch(requestUrl)
  .then(function (response) {
    if (response.ok===false) { // When there's an error, do not continue subsequent executions
    return;
    } else {
      return response.json();
    } 
  })
  .then(function (data) {
    showForecastWeatherData(data); // Show weather information (values)
  });
}

// Show weather data (icon, temp, wind & humidity) in both current weather section and 5-day forecast
function showCurrentWeatherData(fetchedData){
  document.getElementById("selectedCity").textContent = fetchedData.name + ", " + fetchedData.sys.country;
  let iconId = fetchedData.weather[0].icon;
  document.getElementById("icon0").setAttribute("src", `http://openweathermap.org/img/wn/${iconId}.png`); // Show weather icon in current weather section
  document.getElementById("temp0").textContent = Math.round((fetchedData.main.temp - 273.15)*10)/10; // Show temp value in °C in current weather section
  document.getElementById("wind0").textContent = fetchedData.wind.speed; // Show wind speed value in current weather section
  document.getElementById("humi0").textContent = fetchedData.main.humidity; // Show humidity value in current weather section
}

// Show weather data (icon, temp, wind & humidity) in both current weather section and 5-day forecast
function showForecastWeatherData(fetchedData){
  let indexList = [7,15,23,31,39] // Index numbers (7,15,23...) are from the fetched data (+8 = +24hours)
  for (b = 0; b < indexList.length ; b++){
    index = indexList[b];
    let iconId = fetchedData.list[index].weather[0].icon;
    document.getElementById(`icon${b+1}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}.png`); // Show weather icon in respective element
    document.getElementById(`temp${b+1}`).textContent = Math.round((fetchedData.list[index].main.temp - 273.15)*10)/10; // Show temp value in °C in respective element
    document.getElementById(`wind${b+1}`).textContent = fetchedData.list[index].wind.speed; // Show wind speed value in respective element
    document.getElementById(`humi${b+1}`).textContent = fetchedData.list[index].main.humidity; // Show humidity value in respective element
  }
}

// Save the newly searced city name in Local Storage
function saveSearch(fetchedData){
  if (searchedCities === null) {
    searchedCities = {}; // If Local Storage has no data (no search has been done before), "searchCities" is a blank object
  }
  searchedCities[fetchedData.name]=fetchedData.name; // Put the city name in both Key and Value of the object
  localStorage.setItem("cities", JSON.stringify(searchedCities)); // As a Key needs to be unique, same city names won't be added to the object
}

// Show the search history section with bottons of city names that were searched before
function displayHistory(){
  if (document.getElementById("historyTitle") !== null){
    document.getElementById("historyTitle").remove(); // In orderto refresh the section, delete the children elements of the search history section first
  }
  
  searchedCities = JSON.parse(localStorage.getItem("cities")); // Get the latest list of cities from Local Storage
  if (searchedCities !== null) { // Do nothing if the list of cities is empty
    let historyTitle = document.createElement("h5"); // (Re)Create the search history section
    document.getElementById("historySection").appendChild(historyTitle);
    historyTitle.setAttribute("id", "historyTitle");
    historyTitle.textContent = "🌎 Search history";

    for (c = 0; c < Object.keys(searchedCities).length; c++){ // Create city buttons
      let history = document.createElement("button");
      document.getElementById("historyTitle").appendChild(history);
      history.setAttribute("value", Object.keys(searchedCities)[c]);
      history.classList.add("btn", "btn-secondary", "col-12", "my-1", "btn-history");
      history.textContent = Object.keys(searchedCities)[c];
    }
  }
}

// Show the weather information section (right side of the window) after first fetch is conducted 
function displayResultSection(){
  document.getElementById("contentsLeft").classList.add("col-md-3","col-lg-2");
  document.getElementById("contentsRight").classList.remove("d-none");
}

// Show dates in both current weather and 5-day forecast sections (date & time are local - selected city's - time)
function displayDates(fetchedData){
  console.log(fetchedData);
  for (a = 0; a < 6; a++){
    let unixLocalTime = fetchedData.dt + fetchedData.timezone + (86400 * a); // Using the fetched data (time & timezone), calculate unix time for the current date & following 5 days
    let localTime = new Date(unixLocalTime * 1000);
    let localMonth = localTime.getUTCMonth() + 1; // Use getUTCMonth() instead of getMonth() to prevent browser from considering the timezone of the computer that a user is using.
    let localDate = localTime.getUTCDate();
    document.getElementById(`date${a}`).textContent = localMonth + "/" + localDate;
  }
}

// Change the temperature unit to °C
function changeToC(event){
  event.preventDefault();
  fBtn.removeAttribute("disabled"); // This and following 5 lines change the °C/°F buttons' statuses 
  fBtn.classList.add("btn-outline-primary");
  fBtn.classList.remove("btn-primary");
  cBtn.setAttribute("disabled", "");
  cBtn.classList.add("btn-primary");
  cBtn.classList.remove("btn-outline-primary");
  for (e = 0; e < 6; e++){ // Change the values and indications(C/F) of the temperature for both current weather and 5-day forecast
    document.getElementById(`temp${e}`).textContent = Math.round((Number(document.getElementById(`temp${e}`).textContent)-32)*5/9*10)/10;
    document.getElementById(`unitCF${e}`).textContent = "C"
  }
}

// Change the temperature unit to °F
function changeToF(event){
  event.preventDefault();
  cBtn.removeAttribute("disabled"); // This and following 5 lines change the °C/°F buttons' statuses
  cBtn.classList.add("btn-outline-primary");
  cBtn.classList.remove("btn-primary");
  fBtn.setAttribute("disabled", "");
  fBtn.classList.add("btn-primary");
  fBtn.classList.remove("btn-outline-primary");
  for (d = 0; d < 6; d++){ // Change the values and indications(C/F) of the temperature for both current weather and 5-day forecast
    document.getElementById(`temp${d}`).textContent = Math.round((Number(document.getElementById(`temp${d}`).textContent)*9/5+32)*10)/10;
    document.getElementById(`unitCF${d}`).textContent = "F"
  }
}

// Reset the temperature unit to °C when weather data is fetched
function resetCF(){
  fBtn.removeAttribute("disabled");
  fBtn.classList.add("btn-outline-primary");
  fBtn.classList.remove("btn-primary");
  cBtn.setAttribute("disabled", "");
  cBtn.classList.add("btn-primary");
  cBtn.classList.remove("btn-outline-primary");
  for (f = 0; f < 6; f++){
    document.getElementById(`unitCF${f}`).textContent = "C"
  }
}


// Event Listener for "Search" button => get weather information of a new city
searchBtn.addEventListener("click", getInputCity);

// Event Listener for "Search History" section button => get weather information of city previously selected
historySection.addEventListener("click", getClickedCity);

// Event Listener for "°C/°F" buttons => change the unit of temperature
cBtn.addEventListener("click", changeToC);
fBtn.addEventListener("click", changeToF);


init();