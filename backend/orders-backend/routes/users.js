let express = require('express');
let router = express.Router();
const service = require("../services/usersService");

router.get("/", async (req, res) => {
    let dataSet = await service.getUsers();
    if (dataSet) {
        dataSet.forEach((user) => delete user.login);
    } else {
        dataSet = [];
    }
    res.send(dataSet);
});

module.exports = router;
