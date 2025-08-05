require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', async (req, res) => {
    let persons
    await Person.find({}).then(person => {
        persons = person
    })
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date(Date.now()).toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
        res.json(person)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person)
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            return res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', async (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'invalid person info'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    console.log('error')

    person.save()
        .then(result => {
            res.json(result)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name: name, number: number } = req.body

    Person.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                res.json(updatedPerson)
            })
        })
        .catch(err => next(err))
})

app.get('/', (req, res) => {
    res.render('index')
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    res.status(400).json({ error: error.message })
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
