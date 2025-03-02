import * as util from "./utils.js";

export class PositionDto {
  key;
  sno;
  dsc;
  qty;
  upr;
  amt;
  ord;
  idx;

  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  builder(key, sno, dsc, qty, upr, amt, {ord, idx}) {
    this.key = key;
    this.sno = sno;
    this.dsc = dsc;
    this.qty = qty;
    this.upr = upr;
    this.amt = amt;
    this.ord = ord;
    this.idx = idx;
  }

  static KEY = `key`;
  static SNO = `sno`;
  static DSC = `dsc`;
  static QTY = `qty`;
  static UPR = `upr`;
  static AMT = `amt`;
  static ORD = `ord`;
  static IDX = `idx`;

  static POS_EXPRESSION = "_posRow_";

  static buildFormId(orderSign, sno) {
    return orderSign + PositionDto.POS_EXPRESSION + sno;
  }

  getFormId() {
    return this.idx + PositionDto.POS_EXPRESSION + this.sno;
  }

  validateNumbers() {
    this.upr = util.validateNumber(this.upr);
    this.qty = util.validateNumber(this.qty);
    this.amt = util.validateNumber(this.amt);
  }

  reCalculateAmount() {
    this.amt = PositionDto.calculatePositionAmount(this.qty, this.upr)
  }

  getViewPositionColumns() {
    this.reCalculateAmount();
    return [this.sno, this.dsc, this.qty, this.upr, this.amt];
  }

  static calculatePositionAmount(qty, upr) {
    if (qty && upr) {
      return (parseFloat(qty) * parseFloat(upr))?.toFixed(2);
    }
    console.warn(`Calculate Position Amount failed! `, qty, upr);
    return '0';
  }
}

export class OrderDto {
  key;
  sno;
  idx;
  amt;
  odt;
  sts;
  cst;
  pos;

  static TBL_APPENDIX = "table_";

  getTableId() {
    return OrderDto.TBL_APPENDIX + this.idx;
  }

  static buildTableId(orderSign) {
    return OrderDto.TBL_APPENDIX + orderSign;
  }

  static getOrderSignFromTableId(tblId) {
    return tblId.substring(OrderDto.TBL_APPENDIX.length);
  }

  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  creator(key, sno, idx, amt, odt, sts, cst) {
    this.key = key;
    this.sno = sno;
    this.idx = idx;
    this.amt = amt;
    this.odt = odt;
    this.sts = sts;
    this.cst = cst;
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

  validateNumbers() {
    this.amt = util.validateNumber(this.amt);
  }

}

export class CustomerDto {
  key;
  sno;
  nme;
  sts;
  txi;
  adr;

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
