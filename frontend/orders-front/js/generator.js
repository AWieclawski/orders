import {CustomerDto, OrderDto, PositionDto} from "./models.js";
import * as formGen from './formGenerator.js';

const POSITIONS_HEADER_COLUMNS = ['No', 'Description', 'Quantity', 'Price', 'Amount', ' '];
const MAX_CELL_WIDTH = "180px";
const TABLE_WIDTH = "90%";
const FRM_COLS = POSITIONS_HEADER_COLUMNS.length;

const buildOrdersTab = async (feature) => {
  if (feature?.hasOwnProperty(CustomerDto.NME)) {
    const customerOrders = feature.ord;
    document.querySelector("#customerName").innerHTML = "Orders of: " + feature.nme;
    const customerOrdersNode = document.querySelector("#customerOrders")
    // clear customerOrdersNode before build
    customerOrdersNode.innerHTML = '';
    if (!Array.isArray(customerOrders)) {
      console.warn("No customer orders list: " + customerOrders);
    }
    let tableElements = generateTable(customerOrders, false);
    if (tableElements) {
      tableElements.forEach(tblElement => {
        customerOrdersNode.appendChild(tblElement);
      });
    } else {
      console.warn("Table not build! ", tableElements);
    }
  } else {
    console.error("Not found feature to build customers tables! ", feature);
  }
}

function generateTable(customerOrders) {
  const tables = [];

  if (Array.isArray(customerOrders)) {
    customerOrders.forEach((order) => {
      const tbl = document.createElement("table");
      tbl.setAttribute("width", TABLE_WIDTH);
      const tblBody = document.createElement("tbody");
      const orderDto = new OrderDto(order);
      const rowOrd = document.createElement("tr");
      const orderCell = document.createElement("th");
      const cellText = document.createTextNode(`${orderDto.sno}. Order No: ${orderDto.idx} dated: ${orderDto.odt} with status: ${orderDto.sts}`);
      orderCell.appendChild(cellText);
      orderCell.setAttribute("colspan", FRM_COLS.toString());
      orderCell.classList.add("orderHeader");
      rowOrd.appendChild(orderCell);
      tblBody.appendChild(rowOrd);
      let positions = orderDto.pos;
      if (positions && Array.isArray(positions)) {
        let headers = POSITIONS_HEADER_COLUMNS.slice();
        const rowPosHeader = viewRow(headers, 'th');
        tblBody.appendChild(rowPosHeader);
        positions.forEach((pos) => {
          let positionDto = new PositionDto(pos);
          positionDto.reCalculateAmount();
          positionDto.idx = orderDto.idx;
          const formId = positionDto.getFormId();
          tbl.id = orderDto.getTableId();
          const rowPosition = formGen.positionRowAsForm(positionDto, 'td', formId);
          tblBody.appendChild(rowPosition);
        });
      }
      tbl.appendChild(tblBody);
      const addRowButton = formGen.buildButtonDivForTable(tbl.id, orderDto.key);
      tbl.appendChild(addRowButton);
      tbl.setAttribute("border", "2");
      tables.push(tbl);
    });
  }
  return tables;
}

function viewRow(posColumns, cellType) {
  const rowPosition = document.createElement("tr");
  posColumns.forEach((colVal) => {
    const cellPos = document.createElement(cellType);
    const cellPosText = document.createTextNode(colVal);
    cellPos.appendChild(cellPosText);
    cellPos.style.maxWidth = MAX_CELL_WIDTH;
    rowPosition.appendChild(cellPos);
  });
  return rowPosition;
}


export {buildOrdersTab};
