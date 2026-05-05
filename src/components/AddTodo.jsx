import { useState } from 'react'

const PRIORITIES = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export default function AddTodo({ dispatch }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    dispatch({
      type: 'ADD_TODO',
      payload: {
        id: crypto.randomUUID(),
        title: trimmed,
        priority,
        dueDate: dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    })
    setTitle('')
    setDueDate('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="add-input"
        type="text"
        placeholder="新しい Todo を追加..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
      <select
        className="priority-select"
        value={priority}
        onChange={e => setPriority(e.target.value)}
        aria-label="優先度"
      >
        {PRIORITIES.map(p => (
          <option key={p.value} value={p.value}>
            優先度: {p.label}
          </option>
        ))}
      </select>
      <input
        className="date-input"
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        aria-label="期限日"
      />
      <button className="add-btn" type="submit">
        追加
      </button>
    </form>
  )
}
