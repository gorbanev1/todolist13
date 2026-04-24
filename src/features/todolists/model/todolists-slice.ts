import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export type DomainTodolist = Todolist & {
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

    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
      },
    ),
    setTodolistAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      return action.payload.todolists.map((tl) => {
        return { ...tl, filter: "all" }
      })
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => {
          return { ...tl, filter: "all" }
        })
      })
      .addCase(fetchTodolistsTC.rejected, (state, action) => {})
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
      })
      .addCase(changeTodolistTitleTC.rejected, (state, action) => {})
      .addCase(deleteTodolistTC.fulfilled, (state, action)=>{
        return state.filter(tl=>tl.id!==action.payload.id)
      })
  },
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetch-todolists`, async (_, thunkAPI) => {
  try {
    const res = await todolistsApi.getTodolists()
    return { todolists: res.data }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/change-todolist-title`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
    }
    catch (error){
      return thunkAPI.rejectWithValue(error)
    }

  },
)
export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/delete-todolist`,
  async (payload:{id:string},thunkAPI)=>{
    try{
      await todolistsApi.deleteTodolist(payload.id)
      return payload
    }
    catch (error){
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const { setTodolistAC, deleteTodolistAC,  changeTodolistFilterAC, createTodolistAC } =
  todolistsSlice.actions

export type FilterValues = "all" | "active" | "completed"
