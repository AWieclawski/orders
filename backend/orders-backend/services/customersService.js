const core = require("./serviceCore");

async function getCustomers() {
    return await core.getAllQuery("select * from customers");
}

async function getActiveCustomers() {
    return await core.getAllQuery("select * from customers where status = 'ACTIVE'");
}

module.exports = {getCustomers: getCustomers, getActiveCustomers: getActiveCustomers}
