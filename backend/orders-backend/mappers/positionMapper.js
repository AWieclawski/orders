const {Position} = require("../models/EntityModels");
const {PositionDto} = require("../models/DtoModels");

function positionsToDtos(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        let counter = 1;
        inputList.forEach((position) => {
            let entity = new Position(position);
            outputList.push(positionToDto(entity, counter));
            counter++;
        });
    } else {
        return [positionToDto(inputList, 1)];
    }
    return outputList;
}

function positionToDto(input, counter) {
    let output = new PositionDto();
    if (input) {
        if (input.id) output.key = input.id;
        if (input.sno) {
            output.sno = input.sno;
        } else {
            output.sno = counter;
        }
        output.qty = input.quantity;
        output.upr = input.unit_price;
        if (input.order_id) output.ord = input.order_id;
        output.dsc = input.description;
    }
    return output;
}

function dtosToPositions(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        inputList.forEach((dto) => {
            let posDto = new PositionDto(dto);
            outputList.push(dtoToPosition(posDto));
        });
    } else {
        return [dtoToPosition(inputList)];
    }
    return outputList;
}

function dtoToPosition(input) {
    let output = new Position();
    if (input) {
        if (input.key) output.id = input.key;
        output.quantity = input.qty;
        output.unit_price = input.upr;
        if (input.ord) output.order_id = input.ord;
        output.description = input.dsc;
    }
    return output;
}

// String
const getPositionAmountValue = (positionDto) => {
    return positionAmount(positionDto)?.toFixed(2);
}

// Float
const positionAmount = (positionDto) => {
    return (parseFloat(positionDto.qty) * parseFloat(positionDto.upr));
}


module.exports = {
    positionToDto: positionToDto,
    positionsToDtos: positionsToDtos,
    dtosToPositions: dtosToPositions,
    dtoToPosition: dtoToPosition,
    calcPositionValue: positionAmount
};