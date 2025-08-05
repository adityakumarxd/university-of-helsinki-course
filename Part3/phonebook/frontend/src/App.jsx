import { useState, useEffect } from 'react'
import Input from './components/Input';
import List from './components/List';
import Filter from './components/Filter';
import Notification from "./components/Notification";
import personsService from './services/persons'
import './index.css'

const App = () => {
	const [persons, setPersons] = useState([])

	useEffect(() => {
		personsService
			.getAll()
			.then(res => {
				console.log('promise fulfilled', res)
				setPersons(res)
			})
	}, [])

	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [existed, setExisted] = useState(false)
	const [filter, setFilter] = useState('')
	const [message, setMessage] = useState({ text: null, type: 'success' })

	function handleNameChange(e) {
		const inputName = e.target.value
		setNewName(inputName)
		setExisted(persons.filter(person => person.name === inputName).length > 0)
	}

	function handleNumberChange(e) {
		setNewNumber(e.target.value)
	}

	function renderMessage(newMsg, type) {
		setMessage({ text: newMsg, type: type })
		setTimeout(() => {
			setMessage({ ...message, text: null })
		}, 5000)
	}

	function addPerson(e) {
		e.preventDefault()

		if (existed) {
			const person = persons.filter(p => p.name === newName)[0]
			const changedNumber = { ...person, number: newNumber }
			if (window.confirm(`${changedNumber.name} is already added to phonebook, replace the old number with a new one?`)) {
				personsService.update(changedNumber.id, changedNumber)
					.then((res) => {
						setPersons(persons.map((p) => (p.id !== changedNumber.id ? p : res)))
						renderMessage(`Updated ${changedNumber.name}`, 'success')
					})
					.catch((err) => {
						renderMessage(err.response.data.error, 'error')
						personsService
							.getAll()
							.then(res => {
								console.log('promise fulfilled', res)
								setPersons(res)
							})
					})
			}
		} else {
			const contact = {
				name: newName,
				number: newNumber
			}
			personsService
				.create(contact)
				.then(res => {
					if (!res.error) {
						setPersons(persons.concat(res))
						setNewName('')
						setNewNumber('')
						renderMessage(`Added ${res.name}`, 'success')
					} else {
						renderMessage(res.error, "error")
					}
				})
				.catch(err => {
					console.log(err)
					renderMessage(err.response.data.error, 'error')
				})
		}
	}

	function handleFilterChange(e) {
		setFilter(e.target.value)
	}

	function deletePerson(e) {
		const deleteId = e.target.value
		const deletePerson = persons.filter(p => p.id === deleteId)
		if (window.confirm(`Delete ${deletePerson[0].name}?`)) {
			personsService
				.remove(deleteId)
				.then(res => {
					console.log(res)
					setPersons(persons.filter(p => p.id !== deleteId))
				})
		}
	}

	const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))


	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={message} />
			<Filter label='filter shown with' onChange={handleFilterChange} value={filter} type='text' />
			<h2>add a new</h2>
			<form>
				<div>
					<Input label='name' onChange={handleNameChange} value={newName} type='text' />
					<Input label='number' onChange={handleNumberChange} value={newNumber} type='text' />
				</div>
				<div>
					<button onClick={addPerson} type="submit">add</button>
				</div>
			</form>
			<h2>Numbers</h2>
			<List persons={personsToShow} onDelete={deletePerson} />
		</div>
	)
}

export default App