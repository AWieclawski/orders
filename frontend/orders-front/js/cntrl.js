const METHODS = ['GET', 'POST', 'DELETE'];

const CUSTOMERS_URL = 'http://localhost:3000/customers';
const CUSTOMER_ORDERS_URL = 'http://localhost:3000/orders/by-customer';
const ORDER_POSITIONS_EDIT_URL = 'http://localhost:3000/positions/by-order';
const POST_UPDATE_URL = `http://localhost:3000/positions/update`;
const POST_DELETE_URL = `http://localhost:3000/positions/delete`;

/**
 *
 * https://attacomsian.com/blog/xhr-post-request
 *
 * @param method
 * @param url
 * @param paramName
 * @param paramValue
 * @param form
 * @returns {Promise<unknown>}
 */

const doHttpRequest = async (method, url, paramName, paramValue, form) => {

  // console.log('doHttpRequest start:', 'method', method, ',url', url, ',paramName', paramName, ',paramValue', paramValue);

  let fullUrl;
  if (paramName && paramValue) {
    fullUrl = url + '?' + paramName + '=' + paramValue;
  } else {
    fullUrl = url;
  }

  // console.log(' - - fullUrl: ', fullUrl, method);

  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let postTest = method.toString().toUpperCase() === 'POST';

    xhr.onreadystatechange = async () => {
      if (xhr && xhr.readyState === 4 && xhr.status === 200 && xhr.responseText) {
        resolve(xhr.responseText);
        if (form) {
          form.reset();
        }
      }
    };
    xhr.onerror = reject;
    xhr.open(method, fullUrl);
    if (postTest) {
      prepareForPostAsJson(xhr);
    }
    if (form && postTest) {
      let json = '{}';
      try {
        let data = new FormData(form);
        json = JSON.stringify(Object.fromEntries(data));
      } catch (err) {
        console.error(`Post request to ${fullUrl} failed! `, form, err.message)
      }
      xhr.send(json);
    } else {
      xhr.send();
    }
  });
}

const prepareForPostAsJson = (xhr) => {
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
}

const getUrlResponse = async (method, url, paramName, paramValue, form) => {
  if (method && METHODS.includes(method.toUpperCase())) {
    let responseText = await doHttpRequest(method, url, paramName, paramValue, form);
    // console.log(' - Received:', responseText, 'by', method);
    return JSON.parse(String(responseText));
  } else {
    console.error(`Method ${method} not found!`);
    return JSON.parse(String({}));
  }
}

export {getUrlResponse, CUSTOMERS_URL, CUSTOMER_ORDERS_URL, POST_UPDATE_URL, POST_DELETE_URL};
