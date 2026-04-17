import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export type DomainTodolist=Todolist & {
  filter: FilterValues
}

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({ ...action.payload, filter: "all",addedDate: '', order: 0 })
      },
    ),
    setTodolistAC: create.reducer<{ todolists: Todolist[] }>((state, action)=>{
      return action.payload.todolists.map((tl) => {
        return {...tl, filter:'all'}
      })
    }),

  }),
  extraReducers: builder => {

  }
})

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetch-todolists`,
    async (_,thunkAPI)=>{
    try {
      const res = await todolistsApi.getTodolists()
      return {todolists: res.data}
    }
    catch (error){
      return thunkAPI.rejectWithValue(error)
    }

  }
)

export const {setTodolistAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions


export type FilterValues = "all" | "active" | "completed"
