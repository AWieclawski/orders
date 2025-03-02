// import path in relation to html template location
import {rollDownCustomers} from '../js/utils.js';
import {getDropDownItems} from '../js/builder.js';
import {addRowFunction, deletePosition, editPosition} from '../js/formGenerator.js';

const SHOW_HIDE_ELEMENTS = ['#customersDropDown', '.dropDownItem', '#userInput'];

function rollDownCustomersApp() {
  rollDownCustomers(SHOW_HIDE_ELEMENTS)
}

function addRowFunctionApp(table) {
  addRowFunction(table);
}

function editPositionApp(element) {
  editPosition(element).then(() => console.log("Position Edited"), (e) => {
    console.error("Edit Position failed!" + e.errorMessage);
  });
}

function deletePositionApp(element) {
  deletePosition(element).then(() => console.log("Position Deleted"), (e) => {
    console.error("Delete Position failed!" + e.errorMessage);
  });

}

getDropDownItems()
  .then(() => console.log("Dropdown items generated"), (e) => {
    console.error("Request error at items generator!" + e.errorMessage);
  });

window.rollDownCustomers = rollDownCustomersApp;
window.addRowFunction = addRowFunctionApp;
window.deletePosition = deletePositionApp;
window.editPosition = editPositionApp;
