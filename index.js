const express = require('express');
const fs = require('fs');
const { format } = require('date-fns');
const path = require('path');

const PORT = 7000;
const app = express();

// Ensure the directory exists
const FILE_DIRECTORY = 'Date_timestamp';
if (!fs.existsSync(FILE_DIRECTORY)) {
    fs.mkdirSync(FILE_DIRECTORY);
}

app.get('/', (req, res) => {
    try {
        const today = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
        const filePath = path.join(FILE_DIRECTORY, `${today}.txt`);

        fs.writeFileSync(filePath, today, 'utf8');
        const data = fs.readFileSync(filePath, 'utf8');

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/getTextFiles', (req, res) => {
    fs.readdir(FILE_DIRECTORY, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while listing the files from the directory');
        } else {
            const textFiles = files.filter(file => path.extname(file) === '.txt');
            res.status(200).json(textFiles);
        }
    });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
