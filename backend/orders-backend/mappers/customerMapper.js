const ordMapper = require("./orderMapper");
const {CustomerDto} = require("../models/DtoModels");
const {Customer} = require("../models/EntityModels");

function customersToDtos(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        let counter = 1;
        inputList.forEach(entity => {
            const customer = new Customer(entity);
            outputList.push(customerToDto(customer, counter));
            counter++;
        });
    } else {
        return [customerToDto(inputList)];
    }
    return outputList;
}

function customerToDto(input, counter) {
    let output = new CustomerDto();
    if (input) {
        if (input.id) output.key = input.id;
        if (input.sno) {
            output.sno = input.sno
        } else {
            output.sno = counter;
        }
        if (input.address) output.adr = input.address;
        output.nme = input.name;
        output.txi = input.tax_id;
        output.sts = input.status;
        if (input.orders) output.ord = ordMapper.ordersToDtos(input.orders);
    }
    return output;
}

function dtosToCustomers(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        inputList.forEach(dto => {
            const customerDto = new CustomerDto(dto);
            outputList.push(dtoToCustomer(customerDto));
        });
    } else {
        return [dtoToCustomer(inputList)];
    }
    return outputList;
}

function dtoToCustomer(input) {
    let output = new Customer();
    if (input) {
        if (input.key) output.id = input.key;
        if (input.adr) output.address = input.adr;
        output.name = input.nme;
        output.tax_id = input.txi;
        output.status = input.sts;
        if (input.ord) output.orders = ordMapper.dtosToOrders(input.ord);
    }
    return output;
}


module.exports = {
    customerToDto: customerToDto,
    customersToDtos: customersToDtos,
    dtosToCustomers: dtosToCustomers,
    dtoToCustomer: dtoToCustomer
};