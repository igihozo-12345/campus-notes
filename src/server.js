const express = require('express');
const Database = require('better-sqlite3');

const PORT = process.env.PORT || 3000;

function createApp() {
    const app = express();

    // Create database connection
    const db = new Database(process.env.DB_PATH || ':memory:');

    app.locals.db = db;

    app.use(express.json());

    // Health middleware - required by the practical
    app.use(require('./health.js'));

    let notes = [
        {
            id: 1,
            title: 'Learning Linux',
            body: 'Linux is an operating system.',
            author: 'Racheal'
        },
        {
            id: 2,
            title: 'Learning Node.js',
            body: 'Node.js runs JavaScript.',
            author: 'Racheal'
        },
        {
            id: 3,
            title: 'Working with JSON',
            body: 'JSON stores and exchanges data.',
            author: 'Racheal'
        }
    ];

    // Get all notes
    app.get('/api/notes', (req, res) => {
        res.json(notes);
    });

    // Get one note
    app.get('/api/notes/:id', (req, res) => {
        const id = Number(req.params.id);
        const note = notes.find(n => n.id === id);

        if (!note) {
            return res.status(404).json({
                error: 'Note not found'
            });
        }

        res.json(note);
    });

    // Create a new note
    app.post('/api/notes', (req, res) => {
        const { title, body } = req.body;

        if (!title || !body) {
            return res.status(400).json({
                error: 'Title and body are required'
            });
        }

        const newNote = {
            id: notes.length
                ? Math.max(...notes.map(n => n.id)) + 1
                : 1,
            title,
            body,
            author: 'Racheal'
        };

        notes.push(newNote);
        res.status(201).json(newNote);
    });

    return app;
}

if (require.main === module) {
    const app = createApp();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = { createApp };
