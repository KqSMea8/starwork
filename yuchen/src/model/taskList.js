import * as searchService from '../service/taskList';

export default {

  namespace: 'taskList',

  state: {
    result: [],
    statistic: {},
  },

  effects: {
    * list({ payload }, { call, put }) {
      const rsp = yield call(searchService.list, payload);
      console.log('collection list ');
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
