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
    displayDates();
  });
}

function showWeatherData(fetchedData){
  let iconId = fetchedData.list[0].weather[0].icon;
  document.getElementById("selectedCity").textContent = fetchedData.city.name + ", " + fetchedData.city.country;
  document.getElementById("icon0").setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
  document.getElementById("temp0").textContent = Math.round((fetchedData.list[0].main.temp - 273.15)*10)/10;
  document.getElementById("wind0").textContent = fetchedData.list[0].wind.speed;
  document.getElementById("humi0").textContent = fetchedData.list[0].main.humidity;
  console.log(fetchedData);
  console.log(fetchedData.list[0].weather[0].icon);
}

function displayResultSection(){
  document.getElementById("contentsLeft").classList.add("col-md-3","col-lg-2");
  document.getElementById("contentsRight").classList.remove("d-none");
}

function displayDates(){
  for (a = 0; a < 6; a++){
    document.getElementById(`date${a}`).textContent = dayjs().add(a,"day").format("MMM DD");
  }
}