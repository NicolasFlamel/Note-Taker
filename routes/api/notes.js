const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid')
const notes = require('express').Router();

notes.get('/', async (req, res) => {
    const data = await fs.readFile('./db/db.json', 'utf8')
        .catch(err => console.log(err));
    res.json(JSON.parse(data));
});

notes.post('/', async (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        }

        const data = await fs.readFile('./db/db.json', 'utf8')
            .catch(err => console.log(err));

        const db = JSON.parse(data);

        db.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(db, null, 4), 'utf8')
            .catch(err => console.error(err));

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    } else {
        res.json('Note must have title and text');
    }
});

notes.delete('/:id', async (req, res) => {
    const { id } = req.params

    const data = await fs.readFile('./db/db.json', 'utf8')
        .catch(err => console.error(err))

    const db = JSON.parse(data)
    const newDb = db.filter(note => note.id != id)

    if (newDb.toString() == db.toString()) {
        res.send('ID does not exist');
    }
    else {
        await fs.writeFile('./db/db.json', JSON.stringify(newDb, null, 4), 'utf8')
            .catch(err => console.error(err))
        res.send('Success');
    }
});

module.exports = notes;