import { createSlice, nanoid } from "@reduxjs/toolkit"

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => ({
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),
    createTaskAC: create.reducer<{ todolistId: string; taskTitle: string }>((state, action) => {
      const newTask = { title: action.payload.taskTitle, id: nanoid(), isDone: false }
      state[action.payload.todolistId].unshift(newTask)
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      state[action.payload.todolistId] = state[action.payload.todolistId].map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              title: action.payload.title,
            }
          : task,
      )
    }),
    changeTaskStatusAC: create.reducer<{ todolistID: string; taskId: string; status: boolean }>((state, action) => {
      state[action.payload.todolistID] = state[action.payload.todolistID].map((task) =>
        task.id === action.payload.taskId
          ? {
              ...task,
              isDone: action.payload.status,
            }
          : task,
      )
    }),
  }),
})
export const { deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = taskSlice.actions


export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
