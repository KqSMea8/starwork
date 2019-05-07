import {request, requestFull} from '../util/request';

export function createJob(payload) {
  let url = `/apis/collection/add`;
  let result = request(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  console.log("search result:" + JSON.stringify(result));
  return result;
}

export function createJob3in1(payload) {
  let url = `/apis/collection/addThreeInOne`;
  return requestFull(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

