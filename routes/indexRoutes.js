const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing", { title: 'Mayondo Wood and Furniture Ltd' });
});

// should always the last line
module.exports = router;

