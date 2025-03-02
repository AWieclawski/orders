import {PositionDto} from "./models.js";
import * as ctrl from './cntrl.js';
import {FormBuilder, getNearestRowAncestor, getNearestTableAncestor, isUndef} from "./coreGenerator.js";

/**
 * https://www.geeksforgeeks.org/how-to-add-edit-and-delete-data-in-html-table-using-javascript/
 */

const MAX_FORM_CELL_WIDTH = 150;
const MAX_FORM_CELL_WIDTH_INN = MAX_FORM_CELL_WIDTH - 20;
const MAX_FORM_CELL_WIDTH_ID = 80;
const MAX_FORM_CELL_WIDTH_ID_INN = MAX_FORM_CELL_WIDTH_ID - 20;
const FRM_COLS = 6;

function buildButtonDivForTable(tblId, orderId) {
  const rowAddButton = document.createElement("th");
  rowAddButton.classList.add("underTableButton");
  rowAddButton.setAttribute("colspan", FRM_COLS.toString());
  const addButtonCell = document.createElement("span");
  addButtonCell.innerHTML = `<button type="button" class="addRowButton" onClick="addRowFunction(this)">Add Row</button>`;
  rowAddButton.appendChild(addButtonCell);
  return rowAddButton;
}

function addRowFunction(button) {
  const thisTable = getNearestTableAncestor(button);
  const lastRow = thisTable?.rows[thisTable.rows.length - 1];
  const rowForms = lastRow.getElementsByTagName('form'); // returns Array
  const formElement = rowForms[0]?.elements;
  const lastKey = formElement[PositionDto.KEY].value;
  if (isUndef(lastKey)) {
    window.alert("Save last row before adding the new one!");
    return;
  }
  addRow(formElement, thisTable);
}

function addRow(formElement, thisTable) {
  const orderSign = formElement[PositionDto.IDX]?.value;
  const orderId = formElement[PositionDto.ORD]?.value;
  const lastSno = formElement[PositionDto.SNO]?.value;
  const insertedRow = thisTable.insertRow(-1);
  let posDto = new PositionDto();
  const sno = (Number(lastSno) + 1).toString();
  const formId = PositionDto.buildFormId(orderSign, sno);
  posDto.builder(null, sno, '', 0, 0, 0, {ord: orderId, idx: orderSign});
  buildRowAsForm(insertedRow, posDto, 'td', formId, true);
  addPostRequestToRowSubmit(insertedRow, formId);
}


/**
 * https://stackoverflow.com/a/24849864/11868833
 *
 * HTML5 enable to use the "form" attribute for each input element
 *
 * https://fontawesome.com/v4/cheatsheet/
 *
 * https://stackoverflow.com/a/48042249/11868833
 *
 */
function positionRowAsForm(posDto, cellType, formId) {
  const rowPos = document.createElement("tr");
  buildRowAsForm(rowPos, posDto, cellType, formId);
  addPostRequestToRowSubmit(rowPos, formId);
  return rowPos;
}

function buildRowAsForm(rowPosition, positionDto, cellType, formId, editable) {
  editable = isUndef(editable) ? false : editable;
  const readOnlyStyle = `outline:none; border:none; background-color: #ddd`
  const style = !editable ? readOnlyStyle : '';

  const cellNo = document.createElement(cellType);
  cellNo.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "text", PositionDto.SNO, positionDto.sno, "rightNumber", {
    preBody: `<form id=${formId}><input type="hidden" name=${PositionDto.KEY} value=${positionDto.key} /><input type="hidden" name=${PositionDto.ORD} value=${positionDto.ord} /><input type="hidden" name=${PositionDto.IDX} value=${positionDto.idx} /></form>`,
    inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_ID_INN}px; ${readOnlyStyle}`,
    isReadonly: true
  });
  cellNo.style.maxWidth = MAX_FORM_CELL_WIDTH_ID + 'px';
  rowPosition.appendChild(cellNo);

  const cellDsc = document.createElement(cellType);
  cellDsc.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "text", PositionDto.DSC, positionDto.dsc, null, {
    inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_INN}px; ${style}`,
    isReadonly: !editable
  });
  cellDsc.style.maxWidth = MAX_FORM_CELL_WIDTH + 'px';
  rowPosition.appendChild(cellDsc);

  const cellQty = document.createElement(cellType);
  cellQty.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "text", PositionDto.QTY, positionDto.qty, "rightNumber", {
    inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_INN}px; ${style}`,
    isReadonly: !editable
  });
  cellQty.style.maxWidth = MAX_FORM_CELL_WIDTH + 'px';
  rowPosition.appendChild(cellQty);

  const cellUpr = document.createElement(cellType);
  cellUpr.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "text", PositionDto.UPR, positionDto.upr, "rightNumber", {
    inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_INN}px; ${style}`,
    isReadonly: !editable
  });
  cellUpr.style.maxWidth = MAX_FORM_CELL_WIDTH + 'px';
  rowPosition.appendChild(cellUpr);

  const cellAmt = document.createElement(cellType);
  cellAmt.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "text", PositionDto.AMT, positionDto.amt, "rightNumber", {
    preBody: null,
    inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_INN}px; ${readOnlyStyle}`,
    isReadonly: true
  })
  cellAmt.style.maxWidth = MAX_FORM_CELL_WIDTH + 'px';
  rowPosition.appendChild(cellAmt);

  if (editable) {
    const cellSub = document.createElement(cellType);
    cellSub.innerHTML = FormBuilder.produceFullHtmlInputTag(formId, "submit", null, "&#xf0c7;", null, {
      preBody: '<button onclick="deletePosition(this)"> <i class="fa fa-remove"></i> </button>',
      inputStyle: `max-width: ${MAX_FORM_CELL_WIDTH_INN}px; font-family: FontAwesome`
    })
    cellSub.style.maxWidth = MAX_FORM_CELL_WIDTH + 'px';
    cellSub.style.minWidth = MAX_FORM_CELL_WIDTH_ID + 'px';
    rowPosition.appendChild(cellSub);
  } else {
    const cellEdit = document.createElement(cellType);
    cellEdit.innerHTML = '<button onclick="editPosition(this)"> <i class="fa  fa-edit"></i> </button>';
    cellEdit.style.minWidth = MAX_FORM_CELL_WIDTH_ID + 'px';
    rowPosition.appendChild(cellEdit);
  }
}

async function editPosition(button) {
  const thisRow = getNearestRowAncestor(button);
  const rowForms = thisRow.getElementsByTagName('form');
  const formElement = rowForms[0]?.elements;// returns Array
  let positionDto = mapRowFormsToPositionDto(formElement);
  const formId = PositionDto.buildFormId(positionDto.idx, positionDto.sno);
  thisRow.innerHTML = ''; // clear the row before update
  buildRowAsForm(thisRow, positionDto, 'td', formId, true);
  addPostRequestToRowSubmit(thisRow, formId);
}

function mapRowFormsToPositionDto(formElement) {
  const orderId = formElement[PositionDto.ORD]?.value;
  const thisKey = formElement[PositionDto.KEY]?.value;
  const thisSno = formElement[PositionDto.SNO]?.value;
  const orderSign = formElement[PositionDto.IDX]?.value;
  const dsc = formElement[PositionDto.DSC]?.value;
  const upr = formElement[PositionDto.UPR]?.value;
  const qty = formElement[PositionDto.QTY]?.value;
  const amt = formElement[PositionDto.AMT]?.value;
  let positionDto = new PositionDto();
  positionDto.builder(thisKey, thisSno, dsc, qty, upr, amt, {ord: orderId, idx: orderSign});
  return positionDto;
}

async function deletePosition(button) {
  let thisRow = getNearestRowAncestor(button);
  const thisForms = thisRow.getElementsByTagName('form'); // returns Array
  const formElement = thisForms[0]?.elements;
  const thisKey = formElement[PositionDto.KEY]?.value;
  const thisSno = formElement[PositionDto.SNO]?.value;
  let posDto = new PositionDto();
  posDto.builder(thisKey, thisSno, '', 0, 0, 0, {});
  const test = await deletePositionRequest(posDto);
  if (test) {
    doAfterDeleteRequestOk(thisRow, button, thisSno);
  }
}

function doAfterDeleteRequestOk(thisRow, button, sno) {
  const table = getNearestTableAncestor(button);
  thisRow?.parentNode?.removeChild(thisRow);
  if (table) {
    updateSnosInRowsAfterDelete(sno, table);
  }
}

function updateSnosInRowsAfterDelete(sno, table) {
  const rowsTmp = table?.rows;
  const tableLength = rowsTmp?.length;
  let counter = 0;
  if (rowsTmp && tableLength && tableLength > 0) {
    while (counter < tableLength) {
      const rowTmp = rowsTmp[counter];
      changeSnoInForm(rowTmp, sno);
      counter++;
    }
  }
}

function changeSnoInForm(rowTmp, sno) {
  const thisForms = rowTmp?.getElementsByTagName('form'); // returns Array
  if (thisForms) {
    const formElement = thisForms[0]?.elements;
    if (formElement) {
      const orderSign = formElement[PositionDto.IDX]?.value;
      const lastSno = formElement[PositionDto.SNO]?.value;
      if (lastSno && lastSno > sno) {
        const formId = PositionDto.buildFormId(orderSign, lastSno);
        const form = document.forms[formId];
        const newSno = lastSno - 1;
        form[PositionDto.SNO].value = newSno;
        form.id = PositionDto.buildFormId(orderSign, newSno);
      }
    }
  }
}


const deletePositionRequest = async (position) => {
  const url = ctrl.POST_DELETE_URL;
  try {
    const dto = new PositionDto(position);
    const resultJSON = await ctrl.getUrlResponse('DELETE', url, 'position', dto.key);
    console.log(`Response OK: `, resultJSON, 'Deleted!');
    return true;
  } catch (err) {
    console.error(`Delete failed at ${url} : ${[position]}`, err.message);
  }
  return false;
}

const addPostRequestToRowSubmit = (rowPos, formId) => {
  const positionFormElement = rowPos.querySelector(`#${formId}`);
  positionFormElement.addEventListener('submit', async event => {
    event.preventDefault();
    const url = ctrl.POST_UPDATE_URL;
    let response;
    const formFromDom = rowPos.querySelector(`#${formId}`);
    try {
      response = await ctrl.getUrlResponse('POST', url, null, null, formFromDom);
    } catch (err) {
      console.error(`Post failed at ${url} : ${[positionFormElement]}`, err.message);
    }
    console.log(`Response OK:`, response, 'Submitted!');
    if (response) {
      if (Array.isArray(response)) {
        for (const res of response) {
          await updateRowCells(res, formFromDom.id);
          await makeRowReadOnlyAfterUpdate(formFromDom);
        }
      } else {
        await updateRowCells(response, formFromDom.id);
        await makeRowReadOnlyAfterUpdate(formFromDom);
      }
    }
  });
}

async function makeRowReadOnlyAfterUpdate(formFromDom) {
  let positionDto = mapRowFormsToPositionDto(formFromDom);
  const formId = PositionDto.buildFormId(positionDto.idx, positionDto.sno);
  let thisRow = getNearestRowAncestor(formFromDom);
  thisRow.innerHTML = ''; // clear the row before update
  buildRowAsForm(thisRow, positionDto, 'td', formId, false);
  addPostRequestToRowSubmit(thisRow, formId);
}


const updateRowCells = async (response, formId) => {
  let updPosition = new PositionDto(response);
  updPosition.reCalculateAmount();
  const form = document.forms[formId];
  const formElements = form.elements;
  const keyValue = formElements[PositionDto.KEY].value;
  if (isUndef(keyValue)) formElements[PositionDto.KEY].value = updPosition.key;
  formElements[PositionDto.DSC].value = updPosition.dsc;
  formElements[PositionDto.UPR].value = updPosition.upr;
  formElements[PositionDto.QTY].value = updPosition.qty;
  formElements[PositionDto.AMT].value = updPosition.amt;
}

export {buildButtonDivForTable, positionRowAsForm, addRowFunction, deletePosition, editPosition};
