import * as searchService from '../service/search';

export default {

  namespace: 'search',
  scenenamespace: 'sceneSearch',
  actionnamespace:'actionSearch',
  state: {
    result: [],
    statistic: {},
  },

  effects: {
    * search({ payload }, { call, put }) {
      const rsp = yield call(searchService.search, payload);
      console.log('search list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * sceneSearch({ payload }, { call, put }) {
      const rsp = yield call(searchService.sceneSearch, payload);
      console.log('search list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * actionSearch({ payload }, { call, put }) {
      const rsp = yield call(searchService.actionSearch, payload);
      console.log('search list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * createJob({ payload }, {call, put}) {
      console.log('create job0:', payload);
      const rsp = yield call(searchService.createJob, payload);
      console.log('create job1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
      return rsp;
    },
    * createJob3in1({ payload }, {call, put}) {
      console.log('create job 3in1 0:', payload);
      const rsp = yield call(searchService.createJob3in1, payload);
      console.log('create job 3in1 1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
      return rsp;
    },
    * deleteOne({payload}, {call, put}) {
      const rsp = yield call(searchService.deleteOne, payload);
      console.log('deleteOne');
      console.log(rsp);
      return rsp;
    },
    * addOne({payload}, {call, put}) {
      const rsp = yield call(searchService.addOne, payload);
      yield put({type: 'queryList'});
      return rsp;
    },
    * getStatistic({payload}, {call, put}) {
      const rsp = yield call(searchService.getStatistic, payload);
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
