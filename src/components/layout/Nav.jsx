function Nav({ currentPage, onNavigate }) {
  const pages = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <div className="flex gap-2 bg-slate-800 p-2 rounded-lg">
      {pages.map((p) => (
        <button
          key={p.key}
          onClick={() => onNavigate(p.key)}
          className={`flex-1 text-sm py-2 rounded ${
            currentPage === p.key
              ? 'bg-blue-600 text-white'
              : 'text-slate-300'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default Nav