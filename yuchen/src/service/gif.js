import request from '../util/request';

export function search(payload) {
  let [qipuId] = payload;
  let url = `/apis/gif/${qipuId}`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}

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
  let result = request(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  console.log("search result:" + JSON.stringify(result));
  return result;
}

export function getPlayInfo(payload) {
  let [qipuId, startSec, endSec] = payload;
  let url = `/apis/views/play?qipuid=${qipuId}&startSec=${startSec}&endSec=${endSec}&m3u8=0`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}

export function deleteOne(id) {
  return request(`/api/search/${id}`, {
    method: 'DELETE'
  });
}

export function addOne(data) {
  return request('/api/search/add', {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getStatistic(id) {
  return request(`/api/search/${id}/statistic`);
}
