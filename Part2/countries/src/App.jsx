import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import Country from './components/Country';
import countriesService from "./services/countries";
import CountriesList from './components/CountriesList';

function App() {
	const [countries, setCountries] = useState([])
	const [query, setQuery] = useState('')
	const [selected, setSelected] = useState(null)
	const [countriesToShow, setCountriesToShow] = useState([])
	const [weather, setWeather] = useState(null)

	useEffect(() => {
		countriesService
			.getAll()
			.then(res => {
				console.log('promise fulfilled', res)
				const list = []
				for (let i of res) {
					list.push(i.name.common)
				}
				setCountries(list)
			})
	}, [])

	function handleQueryOnChange(evt) {
		const filter = evt.target.value
		const show = countries.filter(c => c.toLowerCase().includes(filter.toLowerCase()))
		setQuery(filter)
		setCountriesToShow(show)
		if (show.length == 1) {
			countriesService
				.getOne(show[0])
				.then(res => {
					setSelected(res)
				})
		} else {
			setSelected(null)
		}

	}

	function getCountry(e) {
		countriesService
			.getOne(e.target.value)
			.then(res => {
				setSelected(res)
				getWeather(res)
			})
	}

	function getWeather(country) {
		countriesService
			.getGeo(country)
			.then(res => {
				countriesService
					.getWeather(res.lat, res.lon)
					.then(res => {
						setWeather(res)
					})
			})
			.catch((e) => {
				console.log('No weather available')
				setWeather(null)
			})
	}


	return (
		<>
			<Filter label='find countries' onChange={handleQueryOnChange} type='text' value={query} />
			<CountriesList list={countriesToShow} onSelect={getCountry} />
			<Country country={selected} weather={weather} />
		</>
	)
}

export default App
