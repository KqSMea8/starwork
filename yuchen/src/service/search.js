import request from '../util/request';

export function search(payload) {
  let [actorId, albumId, videoId,pageSize,channelId,emotion,gender,age,mask,faceQuality,nice,faceAngle,glass,pageNo] = payload;
  let url = `/apis/segmentSearch/queryByActor?actorId=${actorId||""}&albumId=${albumId||""}&videoId=${videoId||""}&channelId=${channelId||""}&emotion=${emotion||""}&faceAngle=${faceAngle||""}&mask=${mask||""}&faceQuality=${faceQuality||""}&age=${age||""}&gender=${gender||""}&glass=${glass||""}&nice=${nice||""}&pageSize=${pageSize}&pageNo=${pageNo||""}`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}
export function sceneSearch(payload) {
  let [actorId,albumId,videoId,scene,pageSize,pageNo] = payload;
  let url = `/apis/segmentSearch/queryByScene?actorId=${actorId||""}&albumId=${albumId||""}&videoId=${videoId||""}&scene=${scene||""}&pageSize=${pageSize}&pageNo=${pageNo||""}`;
  let result = request(url);
  console.log("search result:" + JSON.stringify(result));
  return result;
}
export function actionSearch(payload) {
  let [actorId,albumId,videoId,action,pageSize,pageNo] = payload;
  let url = `/apis/segmentSearch/queryByAction?actorId=${actorId||""}&albumId=${albumId||""}&videoId=${videoId||""}&action=${action||""}&pageSize=${pageSize}&pageNo=${pageNo||""}`;
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
