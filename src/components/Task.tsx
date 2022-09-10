import { Trash } from "phosphor-react"

import styles from "./Task.module.css"

interface TaskProps {
  id: string
  description: string
  isDone: boolean
  setIsDone: (id: string) => void
  onDelete: (id: string) => void
}

export function Task({ id, description, isDone, setIsDone, onDelete }: TaskProps) {

  const taskClassName = isDone ? styles.checked : ""

  return (
    <div className={`${styles.task} ${taskClassName}`}>
      <div className={styles.checkbox}>
        <input
          name="isDone"
          type="checkbox"
          readOnly
          checked={isDone}
        />

        <label onClick={() => setIsDone(id)} />
      </div>

      <span>
          {description}
        </span>

      <button onClick={() => onDelete(id)}>
        <Trash size={16} />
      </button>
    </div>
  )
}