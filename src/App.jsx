import { useReducer, useEffect } from 'react'
import AddTodo from './components/AddTodo'
import TodoItem from './components/TodoItem'
import './App.css'

const initialState = {
  todos: [],
  filter: 'all',
  search: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, todos: action.todos }
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      }
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
      }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    case 'SET_SEARCH':
      return { ...state, search: action.search }
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) }
    default:
      return state
  }
}

function getFiltered(todos, filter, search) {
  return todos
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('todos-v1')
      if (saved) dispatch({ type: 'LOAD', todos: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('todos-v1', JSON.stringify(state.todos))
  }, [state.todos])

  const filtered = getFiltered(state.todos, state.filter, state.search)
  const activeCount = state.todos.filter(t => !t.completed).length
  const completedCount = state.todos.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="title">
            <span className="title-icon">✓</span>
            Todo
          </div>
          <div className="stats">
            <span className="stat">{activeCount} 件残り</span>
            {completedCount > 0 && (
              <span className="stat stat-done">{completedCount} 件完了</span>
            )}
          </div>
        </header>

        <AddTodo dispatch={dispatch} />

        <div className="search-filter">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="検索..."
              value={state.search}
              onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
            />
            {state.search && (
              <button
                className="clear-search"
                onClick={() => dispatch({ type: 'SET_SEARCH', search: '' })}
              >
                ×
              </button>
            )}
          </div>
          <div className="filter-buttons">
            {[
              { key: 'all', label: 'すべて' },
              { key: 'active', label: '未完了' },
              { key: 'completed', label: '完了済み' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-btn ${state.filter === key ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_FILTER', filter: key })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <main>
          {filtered.length === 0 ? (
            <div className="empty">
              {state.todos.length === 0
                ? '上のフォームから Todo を追加してください'
                : '条件に一致する Todo がありません'}
            </div>
          ) : (
            <ul className="todo-list">
              {filtered.map(todo => (
                <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
              ))}
            </ul>
          )}
        </main>

        {completedCount > 0 && (
          <div className="footer">
            <button
              className="clear-completed"
              onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            >
              完了済みを削除 ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
