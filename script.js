var lat;
var long;
var savedData;

//Data
const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const semanas = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const date = new Date();
const semana = date.getDay();
const dia = date.getDate();
const mes = date.getMonth();
const ano = date.getFullYear();
const horas = date.getHours();
const mins = date.getMinutes();
const minutos = mins < 10 ? "0"+mins : mins;
const mostrarData = semanas[semana] + ", " + meses[mes] + " " + dia + " " + ano;
const mostrarHora = horas + ":" + minutos; 



//DOM

const local = document.querySelector("#local");
const icon = document.querySelector("#icon");
const temperatura = document.querySelector("#temperatura");
const tempo = document.querySelector("#tempo");
const hoje = document.querySelector("#hoje");
const hora = document.querySelector("#hora"); 
const botao = document.querySelector("#botao");
const minmax = document.querySelector("#minmax");



hoje.innerHTML = mostrarData;
hora.innerHTML = mostrarHora; 
   



const handleShowData = data => {
    local.innerHTML = data.name + ", " + data.sys.country; 
    icon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    temperatura.innerHTML = Math.round(data.main.temp - 273.15) + " &deg;C";
    tempo.innerHTML = data.weather[0].description;
    minmax.innerHTML = Math.round(data.main.temp_min - 273.15) + " &deg;C | " + Math.round(data.main.temp_max - 273.15) + " &deg;C";
    botao.addEventListener("click", salvar);
    
    
    

    // Função para salvar os dados

    function salvar(){
        let Hist = [];
        data.horas= horas;
        data.minutos = minutos;
        data.dia = dia;
        data.mes = mes;
        data.ano = ano;
        data.semana = semana;
        if(!localStorage.getItem("Enviados")) {
        Hist.push(data);
        localStorage.setItem("Enviados", JSON.stringify(Hist));
        } else {
        Hist = JSON.parse(localStorage.getItem("Enviados"));
        Hist.push(data);
        localStorage.setItem("Enviados", JSON.stringify(Hist));
         }
        alert ("Dados salvos")

        console.log ("Saved data" + localStorage.getItem("Enviados"));
    }

        //Acessando os dados salvos
    
        if(localStorage.getItem("Enviados")){
            let Hist = [];
            Hist = JSON.parse(localStorage.getItem("Enviados"));

            //Mostrando no HTML

            var msg = "";
            for (i=0; i< Hist.length; i++){
                msg += '<div class="historico"> <div class="dados"> <p class="data">' 
                + Hist[i].dia + " " + meses[Hist[i].mes] + " " + Hist[i].ano + 
                ' | '
                + Hist[i].horas + ":" + Hist[i].minutos + 
                '</p> <p class="temp">'
                + Math.round(Hist[i].main.temp - 273.15) + "&deg; C" + 
                ' - '
                + Hist[i].weather[0].description +
                '</p> </div> <div class="imagem"> <img src="http://openweathermap.org/img/wn/' + Hist[i].weather[0].icon + '@2x.png"> </div> </div>';
                
            }
            document.getElementById("output").innerHTML = msg;
        }

    }




//APIs de Geolocalização e OpenWeather

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position)
        lat = position.coords.latitude;
        long = position.coords.longitude;
        
        const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?lat=" +lat+ "&lon=" +long+ "&appid=365188a979023f59fb0e223305ddb44b";
        console.log("URL: " + BASE_URL);
            
        const getWeather = async () => {
            try{
                const resp = await fetch(BASE_URL);
                const data = await resp.json();
                

                console.log (data);
                data = handleShowData(data);

                }
            catch(e) {
                console.log (e.message);
            }
        }
        
        getWeather();
            
    }, function(error){console.log(error)
        });
} else {
    alert("It was not possible to get your location.");
}