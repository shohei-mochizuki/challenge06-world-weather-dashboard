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

// Get the city name that is inputin the search section and pass it to the function "getWeatherData"
function getInputCity(event){
  event.preventDefault();
  let selectedCity = document.getElementById("city-input").value;
  if (selectedCity===""){ // If the input is blank, show the alert message below and stop the executions
    window.alert("Please type a city name in the search input box");
    return;
  }
  getWeatherData(selectedCity);
}

// Get the city name that is clicked and pass it to the function "getWeatherData"
function getClickedCity(event){
  event.preventDefault();
  let selectedCity = event.target.value;
  getWeatherData(selectedCity);
}

// Fetch weather data from OpenWeather server
function getWeatherData(city){
  let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; 
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
    showWeatherData(data); // Show weather information (values)
    saveSearch(data); // Save this new city name in Local Storage
    displayResultSection(); // Show weather information section (right side of the window) in case it's not shown
    displayDates(); // Show dates of today and 5 following days
    displayHistory(); // Refresh (or create) search history section and list the city names that have been searched
    resetCF(); // Reset the temperature unit settings to °C
  });
}

// Show weather data (icon, temp, wind & humidity) in both current weather section and 5-day forecast
function showWeatherData(fetchedData){
  document.getElementById("selectedCity").textContent = fetchedData.city.name + ", " + fetchedData.city.country;
  let indexList = [0,7,15,23,31,39] // [0] for current weather and [7,15,23,31,39] for 5-day forecast *Index is from the fetched data
  for (b = 0; b < indexList.length ; b++){
    index = indexList[b];
    let iconId = fetchedData.list[index].weather[0].icon;
    document.getElementById(`icon${b}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}.png`); // Show weather icon in respective element
    document.getElementById(`temp${b}`).textContent = Math.round((fetchedData.list[index].main.temp - 273.15)*10)/10; // Show temp value in °C in respective element
    document.getElementById(`wind${b}`).textContent = fetchedData.list[index].wind.speed; // Show wind speed value in respective element
    document.getElementById(`humi${b}`).textContent = fetchedData.list[index].main.humidity; // Show humidity value in respective element
  }
}

// Save the newly searced city name in Local Storage
function saveSearch(fetchedData){
  if (searchedCities === null) {
    searchedCities = {}; // If Local Storage has no data (no search has been done before), "searchCities" is a blank object
  }
  searchedCities[fetchedData.city.name]=fetchedData.city.name; // Put the city name in both Key and Value of the object
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

// Show dates in both current weather and 5-day forecast sections (get today's date from dayjs and add 0 to 5 to each element)
function displayDates(){
  for (a = 0; a < 6; a++){
    document.getElementById(`date${a}`).textContent = dayjs().add(a,"day").format("MMM DD");
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