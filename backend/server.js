const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '/../frontend/build')));

// Else server index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});