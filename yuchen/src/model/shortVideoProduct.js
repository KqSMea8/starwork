import * as jobService from '../service/jobs';

export default {

  namespace: 'shortVideoProduct',

  state: {
    result: [],
    statistic: {},
  },

  effects: {
    * createJob3in1({ payload }, {call, put}) {
      console.log('create job 3in1 0:', payload);
      const rsp = yield call(jobService.createJob3in1, payload);
      console.log('create job 3in1 1:', rsp);
      // yield put({ type: 'createJob', payload: { result: rsp } });
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
