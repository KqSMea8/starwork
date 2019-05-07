import * as collectionService from '../service/collection';

export default {

  namespace: 'collection',

  state: {
    result: [],
    statistic: {},
  },

  effects: {
    * list({ payload }, { call, put }) {
      const rsp = yield call(collectionService.list, payload);
      console.log('collection list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * search({ payload }, { call, put }) {
      const rsp = yield call(collectionService.search, payload);
      console.log('collection search 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * publish({ payload }, {call, put}) {
      console.log('publish job0:', payload);
      const rsp = yield call(collectionService.publish, payload);
      console.log('publish job1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
      return rsp;
    },
    * deleteOne({payload}, {call, put}) {
      const rsp = yield call(collectionService.deleteOne, payload);
      console.log('deleteOne');
      console.log(rsp);
      return rsp;
    },
    * addOne({payload}, {call, put}) {
      const rsp = yield call(collectionService.addOne, payload);
      yield put({type: 'queryList'});
      return rsp;
    },
    * getStatistic({payload}, {call, put}) {
      const rsp = yield call(collectionService.getStatistic, payload);
      yield put({
        type: 'saveStatistic',
        payload: {
          id: payload,
          data: rsp.result,
        },
      });
      return rsp;
    },
  },

  reducers: {
    saveList(state, {payload: {result}}) {
      return {
        ...state,
        result,
      }
    },
    saveStatistic(state, {payload: {id, data}}) {
      return {
        ...state,
        statistic: {
          ...state.statistic,
          [id]: data,
        },
      }
    },
  },
};
