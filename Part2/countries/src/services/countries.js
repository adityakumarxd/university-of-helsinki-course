import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAll = () => {
    const request = axios.get(`${baseUrl}all`)
    return request.then(response => response.data)
}

const getOne = name => {
    const request = axios.get(`${baseUrl}name/${name}`)
    return request.then(response => response.data)
}

const api_key = import.meta.env.VITE_WEATHER_API_KEY

const getGeo = (country) => {
    let url
    if ('capital' in country) {
        url = `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital},${country.cca2}&limit=1&appid=${api_key}`
    } else {
        url = `http://api.openweathermap.org/geo/1.0/direct?q=${country.cca2}&limit=1&appid=${api_key}`
    }
    const request = axios.get(url)
    return request.then(response => response.data[0])
}

const getWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
    const request = axios.get(url)
    return request.then(response => response.data)
}

export default { getAll, getOne, getGeo, getWeather }