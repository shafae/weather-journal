/* Global Variables */
const apiKey = "dac848b7ad4dedb8dd913f294bb4708c";
const genButton = document.getElementById("generate");

//Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

//function for getting data from API
let getWeatherData = async(url) => {
    // get weather data from openweathermap website
    const res = await fetch(url);
    try {
        // convert data to json for reading easily    
        const data = await res.json();
        console.log(data);
        // return data to pass it to postWeatherData function to get temp from it 
        return data;
    } catch (error) {
        console.log("ERROR", error);
    }
};

//function for posting data to server
let postWeatherData = async(url, data = {}) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch {
        console.log("ERROR", error);
    }
};

//function for updating UI
let updateUI = async() => {
    const receivedData = await getWeatherData('getData');
    console.log(receivedData);
    //show coming data on the ui 
    try {
        document.getElementById("temp").innerHTML = `Temperature: ${receivedData.temp}`;
        document.getElementById("date").innerHTML = `Date: ${receivedData.date}`;
        document.getElementById("content").innerHTML = `Feeling: ${receivedData.feelings}`;
    } catch (err) {
        console.log("ERROR", error);
    }
};

// get/post data from/to server and update UI   **event**
let buttonAction = async(evt) => {
    evt.preventDefault();

    // get zipCode from text area
    const zipCode = document.getElementById("zip").value;
    // API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=metric`
        // get feelings from users 
    const feelings = document.getElementById("feelings").value;

    try {
        //check zipCode and content text area 
        if (zipCode && feelings) {
            // get data 
            getWeatherData(url)
                //post data
                .then((data) => {
                    postWeatherData('/postData', {
                            temp: data.main.temp,
                            date: newDate,
                            feelings: feelings
                        })
                        //update UI
                        .then(() => {
                            updateUI();
                        });
                })
        } else {
            alert("enter zipCode and what are you feeling")
        }
        //check for any errors occur
    } catch (error) {
        console.log("ERROR", error);

    }
};

// add action for generate button
genButton.addEventListener('click', buttonAction);