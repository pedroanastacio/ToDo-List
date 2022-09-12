import { ChangeEvent, FormEvent, InvalidEvent, useEffect, useState } from "react"
import { PlusCircle, SortAscending, SortDescending } from "phosphor-react"
import { v4 as uuidv4 } from "uuid";

import { Header } from "./components/Header"
import { Button } from "./components/Button"
import { Task } from "./components/Task"
import { Badge } from "./components/Badge"
import clipboard from "./assets/clipboard.svg"

import styles from "./App.module.css"
import "./global.css"

interface Task {
  id: string
  description: string
  isDone: boolean
}

const TASKS = [
  {
    id: uuidv4(),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy text.",
    isDone: false
  },
  {
    id: uuidv4(),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy text.",
    isDone: true
  },
  {
    id: uuidv4(),
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy text.",
    isDone: false
  }
]

export function App() {
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [newTaskDescription, setNewTaskDescription] = useState<string>("")
  const [sortBy, setSortBy] = useState<"done" | "undone" | null>(null)

  const totalTasks = tasks.length
  const tasksDone = tasks.filter(task => task.isDone).length
  const listIsEmpty = tasks.length === 0
  const isSorting = !!sortBy
  const isSortingByUndone = sortBy === "undone"

  function handleNewTaskChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity("")
    setNewTaskDescription(event.target.value)
  }

  function handleNewTaskInvalid(event: InvalidEvent<HTMLInputElement>) {
    event.target.setCustomValidity("Adicione a descrição da nova tarefa!")
  }

  function handleCreateNewTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setTasks([...tasks, {
      id: uuidv4(),
      description: newTaskDescription,
      isDone: false
    }])
    setNewTaskDescription("")
  }

  function handleSortChange() {
    switch (sortBy) {
      case "done":
        setSortBy("undone")
        const tasksSortedByUndone = tasks.sort((a, b) => Number(a.isDone) - Number(b.isDone))
        setTasks(tasksSortedByUndone)
        break
      case "undone":
        setSortBy(null)
        const tasksWithoutSort = tasks.sort((a, b) => Math.random() - 0.5)
        setTasks(tasksWithoutSort)
        break
      case null:
        setSortBy("done")
        const tasksSortedByDone = tasks.sort((a, b) => Number(b.isDone) - Number(a.isDone))
        setTasks(tasksSortedByDone)
        break
      default:
        return
    }
  }

  function handleTaskIsDoneChange(id: string) {
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, isDone: !task.isDone }
      }

      return task
    })

    setTasks(newTasks)
  }

  function handleDeleteTask(id: string) {
    const remainingTasks = tasks.filter(task => task.id !== id)
    setTasks(remainingTasks)
  }

  function handleDeleteAll() {
    setTasks([])
  }

  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <form onSubmit={handleCreateNewTask}>
            <input
              name="task"
              placeholder="Adicione uma nova tarefa"
              required
              value={newTaskDescription}
              onChange={handleNewTaskChange}
              onInvalid={handleNewTaskInvalid}
            />

            <Button>
              Criar
              <PlusCircle size={20} weight="bold" />
            </Button>
          </form>

          <main>
            <header>
              <div className={styles.count}>
                <h5 className={styles.createdTasks}>Tarefas criadas</h5>
                <Badge>
                  {totalTasks}
                </Badge>
              </div>

              <div className={styles.count}>
                <h5 className={styles.done}>Concluídas</h5>
                <Badge>
                  {
                    listIsEmpty ? 0 : `${tasksDone} de ${totalTasks}`
                  }
                </Badge>
              </div>
            </header>

            {
              listIsEmpty ?
                <div className={styles.emptyList}>
                  <img src={clipboard} alt="Prancheta" />

                  <span>
                    <b>Você ainda não tem tarefas cadastradas</b><br />
                    Crie tarefas e organize seus itens a fazer
                  </span>
                </div>
                :
                <div className={styles.taskList}>
                  <button
                    className={`${styles.sort} ${isSorting ? styles.sortActive : ""}`}
                    onClick={handleSortChange}
                  >
                    {
                      isSortingByUndone ?
                        <SortDescending size={18} />
                        :
                        <SortAscending size={18} />
                    }
                  </button>

                  {tasks.map(task => {
                    return (
                      <Task
                        key={`task-${task.id}`}
                        id={task.id}
                        description={task.description}
                        isDone={task.isDone}
                        setIsDone={handleTaskIsDoneChange}
                        onDelete={handleDeleteTask}
                      />
                    )
                  })}

                  <button onClick={handleDeleteAll} className={styles.removeAll}>
                    Remover todos
                  </button>
                </div>
            }
          </main>
        </div>
      </div>
    </div>
  )
}


