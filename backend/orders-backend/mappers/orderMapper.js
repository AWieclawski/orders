const posMapper = require("./positionMapper");
const {OrderDto} = require("../models/DtoModels");
const {Order} = require("../models/EntityModels");
const {isUndef} = require("../utils/utility");

function ordersToDtos(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        let counter = 1;
        inputList.forEach((order) => {
            let entity = new Order(order);
            outputList.push(orderToDto(entity, counter));
            counter++;
        });
    } else {
        return [orderToDto(inputList, 1)];
    }
    return outputList;
}

function orderToDto(input, counter) {
    let output = new OrderDto();
    if (input) {
        if (input.id) output.key = input.id;
        if (input.sno) {
            output.sno = input.sno
        } else {
            output.sno = counter;
        }
        output.idx = input.order_no;
        output.pos = !isUndef(input.positions) ? posMapper.positionsToDtos(input.positions) : [];
        if (output.pos) output.amt = getOrderAmountFromPositions(output.pos)?.toFixed(2);
        output.odt = input.order_date;
        output.sts = input.status;
        if (input.customer_id) output.cst = input.customer_id;
    }
    return output;
}

function dtosToOrders(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        inputList.forEach((dto) => {
            let ordDto = new OrderDto(dto);
            outputList.push(dtoToOrder(ordDto));
        });
    } else {
        return [dtoToOrder(inputList)];
    }
    return outputList;
}

function dtoToOrder(input) {
    let output = new Order();
    if (input) {
        if (input.key) output.id = input.key;
        output.order_no = input.idx;
        output.order_date = input.odt;
        output.status = input.sts;
        if (input.cst) output.user_id = input.cst;
        if (input.pos) output.positions = posMapper.dtosToPositions(input.pos);
    }
    return output;
}

const getOrderAmountFromPositions = (positionsDto) => {
    let value = 0.0;
    if (positionsDto && Array.isArray(positionsDto)) {
        positionsDto.forEach(positionDto => {
            let tmp = posMapper.calcPositionValue(positionDto);
            if (tmp) {
                value += tmp;
            }
        });
    }
    return value;
}

module.exports = {
    orderToDto: orderToDto,
    ordersToDtos: ordersToDtos,
    dtosToOrders: dtosToOrders,
    dtoToOrder: dtoToOrder,
    getOrderAmount: getOrderAmountFromPositions
};

