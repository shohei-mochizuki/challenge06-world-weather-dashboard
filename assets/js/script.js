let apiKey = "91968567ff99e1beb7a3cbfb1666acb9";
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
  document.getElementById("selectedCity").textContent = fetchedData.city.name + ", " + fetchedData.city.country;
  let indexList = [0,7,15,23,31,39]
  for (b = 0; b < indexList.length ; b++){
    index = indexList[b];
    console.log(index);

    let iconId = fetchedData.list[index].weather[0].icon;
    document.getElementById(`icon${b}`).setAttribute("src", `http://openweathermap.org/img/wn/${iconId}.png`);
    document.getElementById(`temp${b}`).textContent = Math.round((fetchedData.list[index].main.temp - 273.15)*10)/10;
    document.getElementById(`wind${b}`).textContent = fetchedData.list[index].wind.speed;
    document.getElementById(`humi${b}`).textContent = fetchedData.list[index].main.humidity;

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