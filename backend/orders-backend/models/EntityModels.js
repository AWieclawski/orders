const {CustomerDto} = require("./DtoModels");

class Position {
    id;
    order_id;
    quantity;
    unit_price;
    description;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    create(key, ord, qty, upr, dsc) {
        this.id = key;
        this.order_id = ord;
        this.quantity = qty;
        this.unit_price = upr;
        this.description = dsc;
    }

    static calculatePositionAmount(quantity, unit_price) {
        if (quantity && unit_price) {
            return (parseFloat(quantity) * parseFloat(unit_price))?.toFixed(2);
        }
        console.warn(`Calculate Position Amount failed! `, quantity, unit_price);
        return '0';
    }

    static getUpdatableSet(dto) {
        return `quantity    = ${dto.qty},
        unit_price  = ${dto.upr},
        description = '${dto.dsc}' `;
    }

    static getInsertableSet(dto) {
        return ` (quantity, order_id, unit_price, description) values ( ${dto.qty}, ${dto.ord}, ${dto.upr}, '${dto.dsc}' ) `;
    }
}

class Order {
    id;
    customer_id;
    order_no;
    order_date;
    status;
    pos;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    create(key, cst, idx, amt, odt, sts) {
        this.id = key;
        this.customer_id = cst;
        this.order_no = idx;
        this.order_date = odt;
        this.status = sts;
    }

}

class Customer {
    id;
    name;
    status;
    address;
    tax_id;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

}

module.exports = {Position: Position, Order: Order, Customer: Customer};