const ordMapper = require("./orderMapper");

function usersToDtos(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        inputList.forEach((user) => {
            outputList.push(userToDto(user));
        });
    } else {
        return [userToDto(inputList)];
    }
    return outputList;
}

function userToDto(input) {
    let output = {};
    if (input.id) output.key = input.id;
    if (input.sno) output.sno = input.sno;
    output.nme = input.name;
    output.lgn = input.login;
    output.pht = input.photo;
    if (input.orders) output.ord = ordMapper.ordersToDtos(input.orders);
    return output;
}

function dtosToUsers(inputList) {
    let outputList = [];
    if (Array.isArray(inputList)) {
        inputList.forEach((dto) => {
            outputList.push(dtoToUser(dto));
        });
    } else {
        return [dtoToUser(inputList)];
    }
    return outputList;
}

function dtoToUser(input) {
    let output = {};
    if (input.key) output.id = input.key;
    output.name = input.nme;
    output.login = input.lgn;
    output.photo = input.pht;
    if (input.ord) output.orders = ordMapper.dtosToOrders(input.ord);
    return output;
}


module.exports = {
    userToDto: userToDto, usersToDtos: usersToDtos, dtosToUsers: dtosToUsers, dtoToUser: dtoToUser
};