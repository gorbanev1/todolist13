import { configureStore } from "@reduxjs/toolkit"
import { appSlice } from "./app-slice.ts"
import { taskSlice } from "@/features/todolists/model/tasks-slice.ts"
import { todolistsSlice } from "@/features/todolists/model/todolists-slice.ts"

// объединение reducer'ов с помощью combineReducers

// создание store
export const store = configureStore({
  reducer: {
    [taskSlice.name]: taskSlice.reducer,
    [todolistsSlice.name]: todolistsSlice.reducer,
    [appSlice.name]: appSlice.reducer,
  },
})

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-ignore
window.store = store
