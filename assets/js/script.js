// let lat = "43.65";
// let lon = "-79.34";
// let city = "London";
let apiKey = "91968567ff99e1beb7a3cbfb1666acb9";
// let requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`; // Search with lat & lon
// let requestUrlcity = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // Search with city name

let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", getWeatherData);

function getWeatherData(event){
  event.preventDefault();
  let selectedCity = document.getElementById("city-input").value;
  if (selectedCity===""){
    window.alert("Please type a city name in the search input box");
    return;
  }
  let requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}`;
  
  fetch(requestUrl)
  .then(function (response) {
    if (response.ok===false) {
    alert("Please check the city name again. It may be incorrect.");
    return;
    } else {
      return response.json();
    } 
  })
  .then(function (data) {
    showWeatherData(data);
    displayResultSection();
  });
}

function showWeatherData(fetchedData){
  document.getElementById("selectedCity").textContent += fetchedData.city.name;
  document.getElementById("temp0").textContent += fetchedData.list[0].main.temp;
}

function displayResultSection(){
  document.getElementById("contentsLeft").classList.add("col-md-3","col-lg-2");
  document.getElementById("contentsRight").classList.remove("d-none");
}