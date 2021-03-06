const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')
let rollbar = new Rollbar({
    accessToken: 'af7d6b476c1d4f84b20fe09ef695a736',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())
let students = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex((studentName) => {
        studentName === name
    })

    if (index === -1 && name !== '') {
        students.push(name)
        rollbar.log('student added successfully', {author: 'jared', type: 'manual'})
        res.status(200).send(students)
    } else if (name === '') {
        rollbar.error('no name given')
        res.status(400).send('must provide name')
    } else {
        rollbar.error('studen already exists')
        res.status(400).send('that student already exists')
    }
})

const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`running on port: ${port}`))
