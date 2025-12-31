import { CheckCircle, AlertCircle } from 'lucide-react'
import React from 'react'
import { createRoot } from 'react-dom/client'

let container = null
let timeoutId = null

const createContainer = () => {
  if (!container) {
    container = document.createElement('div')
    container.id = 'global-notification'
    document.body.appendChild(container)
  }
}

const Notification = ({ message, type }) => {
  const isSuccess = type === 'success'

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in
        ${isSuccess ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}
      `}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  )
}

const showNotify = (message, type = 'success', duration = 4000) => {
  createContainer()

  const root = createRoot(container)
  root.render(<Notification message={message} type={type} />)

  if (timeoutId) clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    root.unmount()
  }, duration)
}

// Fonctions simples à utiliser partout
export const notifySuccess = (message, duration) =>
  showNotify(message, 'success', duration)

export const notifyError = (message, duration) =>
  showNotify(message, 'error', duration)
