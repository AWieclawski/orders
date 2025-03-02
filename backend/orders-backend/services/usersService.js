const core = require("./serviceCore");

async function getUsers() {
    return await core.getAllQuery("select * from users");
}

module.exports = {getUsers: getUsers}
