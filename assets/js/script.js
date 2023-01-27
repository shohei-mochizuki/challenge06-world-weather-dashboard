let lat = "43.65";
let lon = "-79.34";
let city = "Atlanta";
let apiKey = "91968567ff99e1beb7a3cbfb1666acb9";
requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`; // Search with lat & lon
requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // Search with city name

// console.log(requestUrl);

// fetch(requestUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });