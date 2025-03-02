const util = require("../utils/utility");

class PositionDto {
    key;
    ord;
    dsc;
    qty;
    upr;
    amt;
    sno;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    builder(key, sno, dsc, qty, upr, amt, ord) {
        this.key = key;
        this.sno = sno;
        this.dsc = dsc;
        this.qty = qty;
        this.upr = upr;
        this.amt = amt;
        this.ord = ord;
    }

    reCalculateAmount() {
        this.amt = PositionDto.calculatePositionAmount(this.qty, this.upr)
    }

    static calculatePositionAmount(qty, upr) {
        if (qty && upr) {
            return (parseFloat(qty) * parseFloat(upr))?.toFixed(2);
        }
        console.warn(`Calculate Position Amount failed! `, qty, upr);
        return '0';
    }

    validateNumbers() {
        this.upr = util.validateNumber(this.upr);
        this.qty = util.validateNumber(this.qty);
        this.amt = util.validateNumber(this.amt);
    }

}

class OrderDto {
    key;
    idx;
    amt;
    odt;
    sts;
    cst;
    sno;
    pos;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    creator(key, idx, amt, odt, sts, cst, sno) {
        this.key = key;
        this.idx = idx;
        this.amt = amt;
        this.odt = odt;
        this.sts = sts;
        this.cst = cst;
        this.sno = sno;
    }

    setPositions(pos) {
        this.pos = pos;
    }

    addPosition(pos) {
        if (this.pos && Array.isArray(this.pos)) {
            this.pos.push(pos);
        } else {
            this.pos = [];
            this.pos.push(pos);
        }
    }

}

class CustomerDto {
    key;
    sno;
    nme;
    sts;

    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    static KEY = `key`;
    static SNO = `sno`;
    static NME = `nme`;
    static STS = `sts`;
    static TXI = `txi`;
    static ADR = `adr`;
}

module.exports = {PositionDto: PositionDto, OrderDto: OrderDto, CustomerDto: CustomerDto};