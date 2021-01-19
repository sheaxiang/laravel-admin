import type { Effect, Reducer } from 'umi';

export type LoadModelState = {
  loading: boolean;
}
export type LoadModelType = {
  namespace: 'load';
  state: LoadModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<LoadModelState>;
  };
}

const LoadModel: {
  effects: {
    query: ({payload}: { payload: any }, {
      call,
      put
    }: { call: any; put: any }) => IterableIterator<any>
  }; namespace: string; reducers: { save: (state, action) => any }; state: { loading: boolean }
} = {
  namespace: 'load',
  state: {
    loading: false,
  },
  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'save',payload: data });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
};

export default LoadModel;
