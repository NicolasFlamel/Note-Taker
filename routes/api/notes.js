const fs = require('fs');
const notes = require('express').Router();

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
      })
    
});

module.exports = notes;