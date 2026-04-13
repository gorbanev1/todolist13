import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { appSlice } from "./app-slice.ts"
import { taskSlice } from "@/features/todolists/model/tasks-slice.ts"
import { todolistsSlice } from "@/features/todolists/model/todolists-slice.ts"

// объединение reducer'ов с помощью combineReducers
const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  todolists: todolistsSlice.reducer,
  app: appSlice.reducer,
})

// создание store
export const store = configureStore({
  reducer: rootReducer,
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
