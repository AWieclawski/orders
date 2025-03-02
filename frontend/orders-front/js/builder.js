// modules must be with .js extension
import {buildOrdersTab} from './generator.js';
import * as ctrl from './cntrl.js';
import {CustomerDto} from "./models.js";

const getDropDownItems = async () => {
  const resultJSON = await ctrl.getUrlResponse('GET', ctrl.CUSTOMERS_URL);
  await addDropdownItems(resultJSON);
}

const addDropdownItems = async features => {
  const dropdownNode = document.querySelector("#customersDropDown");
  dropdownNode.innerHTML = "";
  if (features) {
    const customers = features.map(feature => {
      const customer = new CustomerDto(feature);
      return `<a hidden class="dropDownItem"  href="#" value="${customer.key}">${customer.nme}</a>`
    })
    dropdownNode.innerHTML = `<input hidden type="text" placeholder="Look for..." id="userInput">${customers.join("")}`
    const dropdownANodes = document.querySelectorAll("#customersDropDown a");
    dropdownANodes.forEach(node => {
      node.addEventListener("click", async (event) => {
        const customerId = event?.target?.getAttribute("value");
        await selectCustomer(customerId);
      });
    });
  } else {
    console.log("Not found any features to build drop down items! " + features);
  }
}

const selectCustomer = async customerId => {
  const resultJSON = await ctrl.getUrlResponse('GET', ctrl.CUSTOMER_ORDERS_URL, 'customer', customerId);
  if (Array.isArray(resultJSON)) {
    // expect only one at the received list
    await buildOrdersTab(resultJSON[0]);
  } else {
    await buildOrdersTab(resultJSON);
  }
}

export {getDropDownItems};
