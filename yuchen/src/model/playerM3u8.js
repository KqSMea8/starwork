
export default {

  namespace: 'playerM3u8',

  state: {
    url: "",
  },

  effects: {
    * search({ payload }, { call, put }) {
      const rsp = yield call(searchService.search, payload);
      console.log('search list 0');
      console.log(rsp);
      yield put({ type: 'saveList', payload: { resultList: rsp.result } });
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
    saveList(state, {payload: {resultList}}) {
      return {
        ...state,
        resultList,
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
