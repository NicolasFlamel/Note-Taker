const fs = require('fs');
const { v4: uuidv4 } = require('uuid')
const notes = require('express').Router();

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(err);
            throw err;
        }
        res.json(JSON.parse(data));
    })
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) throw err;

            const db = JSON.parse(data)

            db.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(db, null, 4), 'utf8', (err, data) => {
                if (err) throw err;
            });
        })

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    } else {
        res.json('Note must have title and text');
    }
});

notes.delete('/:id', (req, res) => {
    const { id } = req.params

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;

        const db = JSON.parse(data)
        const newDb = db.filter(note => note.id != id)

        if (newDb.toString() == db.toString()) {
            res.send('ID does not exist');
        } 
        else {
            fs.writeFile('./db/db.json', JSON.stringify(newDb, null, 4), 'utf8', (err, data) => {
                if (err) throw err;
            });
        }
    })
});

module.exports = notes;