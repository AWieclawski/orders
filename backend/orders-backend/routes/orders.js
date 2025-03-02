const core = require("./routerCore");
const router = core.router;
const service = require("../services/orderService");
const customerMapper = require("../mappers/customerMapper");

async function getCustomerOrders(customer) {
    return await service.customerOrders(customer);
}

async function getMaskedCustomerOrders(customer) {
    return await service.maskedUserOrders(customer);
}

async function getOrdersByCustomer(customer, masked) {
    let customers;
    if (masked) {
        customers = await getMaskedCustomerOrders(customer);
    } else {
        customers = await getCustomerOrders(customer);
    }
    return customerMapper.customersToDtos(customers);
}

router.get("/by-customer", async (req, res) => {
    const {customer} = req.query;
    if (customer) {
        let orders = await getOrdersByCustomer(customer, false);
        res.send(orders);
    } else {
        res.send([]);
    }
});

module.exports = {router: router};
