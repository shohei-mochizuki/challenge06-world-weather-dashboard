let apiKey = "91968567ff99e1beb7a3cbfb1666acb9";
let searchBtn = document.getElementById("searchBtn");
let searchedCities = {};

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
    saveSearch(data);
    displayHistory();
    displayResultSection();
    displayDates();
  });
}

function showWeatherData(fetchedData){
  document.getElementById("selectedCity").textContent = fetchedData.city.name + ", " + fetchedData.city.country;
  let indexList = [0,7,15,23,31,39]
  for (b = 0; b < indexList.length ; b++){
    index = indexList[b];
    let iconId = fetchedData.list[index].weather[0].icon;
    document.getElementById(`icon${b}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}.png`);
    document.getElementById(`temp${b}`).textContent = Math.round((fetchedData.list[index].main.temp - 273.15)*10)/10;
    document.getElementById(`wind${b}`).textContent = fetchedData.list[index].wind.speed;
    document.getElementById(`humi${b}`).textContent = fetchedData.list[index].main.humidity;
  }
}

function saveSearch(fetchedData){
  searchedCities[fetchedData.city.name]=fetchedData.city.name;
  localStorage.setItem("cities", JSON.stringify(searchedCities));
}

function displayHistory(){
  searchedCities = JSON.parse(localStorage.getItem("cities"));
  if (searchedCities !== null) {
    let historySection = document.createElement("div");
    document.getElementById("contentsLeft").appendChild(historySection);
    historySection.setAttribute("id", "historySection");
    let history0 = document.createElement("p");
    document.getElementById("historySection").appendChild(history0);
    history0.setAttribute("id", "history0");
    history0.textContent = Object.keys(searchedCities)[0];
  }
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

searchBtn.addEventListener("click", getWeatherData);