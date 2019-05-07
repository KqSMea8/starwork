import * as gifService from '../service/gif';

export default {

  namespace: 'gif',

  state: {
    result: [],
    statistic: {},
  },

  effects: {
    * search({ payload }, { call, put }) {
      const rsp = yield call(gifService.search, payload);
      console.log('search list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { result: rsp.result } });
    },
    * createJob({ payload }, {call, put}) {
      console.log('create job0:', payload);
      const rsp = yield call(gifService.createJob, payload);
      console.log('create job1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
      return rsp;
    },
    * createJob3in1({ payload }, {call, put}) {
      console.log('create job 3in1 0:', payload);
      const rsp = yield call(gifService.createJob3in1, payload);
      console.log('create job 3in1 1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
      return rsp;
    },
    * deleteOne({payload}, {call, put}) {
      const rsp = yield call(gifService.deleteOne, payload);
      console.log('deleteOne');
      console.log(rsp);
      return rsp;
    },
    * addOne({payload}, {call, put}) {
      const rsp = yield call(gifService.addOne, payload);
      yield put({type: 'queryList'});
      return rsp;
    },
    * getStatistic({payload}, {call, put}) {
      const rsp = yield call(gifService.getStatistic, payload);
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
