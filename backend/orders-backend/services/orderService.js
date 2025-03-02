const core = require("./serviceCore");

async function buildDataObject(orders) {
    let idList = [];
    let customers = [];
    let positions = [];
    if (orders) {
        for (const order of orders) {
            idList.push(order.customer_id);
            order.positions = [];
            positions = await core.fetchSelected(order.id, "positions", "order_id");
            if (positions) {
                positions.forEach((position) => {
                    order.positions.push(position);
                });
            }
        }
        let customerIds = core.rmDuplicates(idList);
        customers = await core.fetchSelected(customerIds, "customers", "id");
        if (customers) {
            customers.forEach((customer) => {
                customer.orders = [];
                orders.forEach((order) => {
                    if (order.customer_id === customer.id) {
                        customer.orders.push(order);
                    }
                });
            });
        }
    }
    return customers;
}

async function getCustomerOrders(customer) {
    let orders;
    if (customer) {
        orders = await core.fetchSelected(customer, "orders", "customer_id");
    } else {
        orders = await core.getAllQuery("select * from orders");
    }
    return await buildDataObject(orders);
}

async function getMaskedCustomerOrders(customer) {
    let customers = await getCustomerOrders(customer);
    if (customer) {
        if (Array.isArray(customers)) {
            core.cleanEntities(customers);
            customers.forEach((customer) => {
                if (Array.isArray(customer.orders)) {
                    customer.orders.forEach((order) => {
                        core.cleanEntities(order.positions);
                    });
                    core.cleanEntities(customer.orders);
                }
            });
        }
    }
    return customers;
}

module.exports = {customerOrders: getCustomerOrders, maskedUserOrders: getMaskedCustomerOrders};
