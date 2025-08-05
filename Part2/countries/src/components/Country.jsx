function Weather({ weather }) {
    if (weather == null) {
        return null
    }

    return (
        <>
            <p>Temperature: {weather.main.temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            <p>Wind: {weather.wind.speed} m/s</p>
        </>
    )
}
export default function Country({ country, weather }) {
    if (country == null) {
        return null
    }

    return (
        <>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>

            <h2>Languages</h2>
            {Object.keys(country.languages).map((lang) => <p key={lang} >{country.languages[lang]}</p>)}
            <img src={country.flags.png} alt={country.flags.alt} />
            <Weather weather={weather}/>
        </>
    )
}