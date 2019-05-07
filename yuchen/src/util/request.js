// import fetch from 'dva/fetch';

function checkStatus(response) {

  if (response.status >= 200 && response.status < 300) {
    // console.log("response:{}",response.text());
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  console.log("request url:{}", url);
  const response = await fetch(url, options);
  checkStatus(response);
  let json_result = await response.json();
  console.log("json_result:{}", json_result);
  if(json_result["code"] === "A00000"){
    return {result:json_result["data"]||{}};
  }
}

export async function requestFull(url, options) {
  console.log("request url:{}", url);
  const response = await fetch(url, options);
  checkStatus(response);
  let json_result = await response.json();
  console.log("json_result:{}", json_result);
  return json_result;
}
