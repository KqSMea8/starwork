import request from '../util/request';

export function list(payload) {
  let url = `/apis/collection/list?type=2&taskType=0`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}

export function search(payload) {
  let [starName, albumName, pageSize,pageNo] = payload;
  let url = `/apis/views/queryCollection?personName=${starName||""}&albumName=${albumName||""}&pageSize=${pageSize}&pageNum=${pageNo}`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}

export function publish(payload) {
  let {taskId, description, userId} = payload;
  let url = `/apis/collection/distribute?taskId=${taskId}&userId=${userId}`;
  let result = request(url, {
    method: 'POST',
    body: JSON.stringify(payload)
    // body: {qipuid: qipuId, bgm_qipuid: bgmQipuId, person_id: personId, seg_list: segList}
  });
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
