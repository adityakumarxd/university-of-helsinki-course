const mongoose = require('mongoose')

if (process.argv.length < 4) {
    console.log('give username and password as argument')
    process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const url = `mongodb+srv://${username}:${password}@cluster0.eqyvdlq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
exports.Person = Person

if (process.argv.length > 4) {
    const person = new Person({
        name: process.argv[4],
        number: process.argv[5]
    })

    person.save().then(result => {
        console.log('person saved!')
        console.log(result)
        mongoose.connection.close()
    })
} else {
    console.log('db connected')
}