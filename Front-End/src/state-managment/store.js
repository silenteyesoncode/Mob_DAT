import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [
    { id: '1', name: 'John Doe', age: 30 },
  ],
  tables: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
    },
    addTable: (state, action) => {
      state.tables.push({
        id: Math.random().toString(),
        name: action.payload.name,
        columns: action.payload.columns,
      });
    },
  },
});

export const { addData, addTable } = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
