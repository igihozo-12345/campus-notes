
'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_PATH = ':memory:';

const { createApp } = require('../src/server.js');

let server;
let base;

before(async () => {
    server = createApp().listen(0);

    await new Promise(resolve => server.once('listening', resolve));

    base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close(error => {
            if (error) reject(error);
            else resolve();
        });
    });
});

// Test 1: A title with 120 characters is accepted
test('POST /api/notes accepts a title with 120 characters', async () => {
    const title = 'A'.repeat(120);

    const response = await fetch(`${base}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            body: 'This is a valid note.'
        })
    });

    const data = await response.json();

    assert.equal(response.status, 201);
    assert.equal(data.title.length, 120);
});

// Test 2: A title longer than 120 characters is rejected
test('POST /api/notes rejects a title longer than 120 characters', async () => {
    const title = 'A'.repeat(121);

    const response = await fetch(`${base}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            body: 'This is a valid note.'
        })
    });

    const data = await response.text();

    assert.equal(response.status, 400);
    assert.equal(
        data,
        'A note title cannot exceed 120 characters.'
    );
});
