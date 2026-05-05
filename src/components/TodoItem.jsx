import { useState, useRef, useEffect } from 'react'

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
}

const PRIORITY_LABELS = {
  high: '高',
  medium: '中',
  low: '低',
}

const TODAY = new Date().toISOString().split('T')[0]

export default function TodoItem({ todo, dispatch }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== todo.title) {
      dispatch({ type: 'UPDATE_TODO', id: todo.id, updates: { title: trimmed } })
    } else {
      setEditTitle(todo.title)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setEditing(false)
    }
  }

  function startEditing() {
    if (todo.completed) return
    setEditTitle(todo.title)
    setEditing(true)
  }

  const isOverdue = todo.dueDate && !todo.completed && todo.dueDate < TODAY

  return (
    <li
      className={`todo-item${todo.completed ? ' done' : ''}`}
      style={{ '--priority-color': PRIORITY_COLORS[todo.priority] }}
    >
      <button
        className="checkbox"
        onClick={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && '✓'}
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            ref={inputRef}
            className="edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="todo-title" onDoubleClick={startEditing}>
            {todo.title}
          </span>
        )}
        <div className="todo-meta">
          <span
            className="priority-badge"
            style={{ color: PRIORITY_COLORS[todo.priority] }}
          >
            {PRIORITY_LABELS[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className={`due-date${isOverdue ? ' overdue' : ''}`}>
              {isOverdue ? '⚠ ' : ''}
              {todo.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        {!todo.completed && !editing && (
          <button
            className="action-btn edit-btn"
            onClick={startEditing}
            aria-label="編集"
            title="編集 (ダブルクリックでも可)"
          >
            ✎
          </button>
        )}
        <button
          className="action-btn delete-btn"
          onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}
          aria-label="削除"
        >
          ✕
        </button>
      </div>
    </li>
  )
}
