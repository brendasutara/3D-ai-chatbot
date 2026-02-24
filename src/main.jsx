import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (typeof window !== 'undefined') {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__
  if (hook && typeof hook.inject === 'function' && !hook.__patchedSemverInject) {
    const originalInject = hook.inject.bind(hook)
    hook.inject = (renderer) => {
      if (!renderer || typeof renderer !== 'object') return originalInject(renderer)
      const fallback = React.version || '19.0.0'
      const patchedRenderer = {
        ...renderer,
        version: renderer.version || fallback,
        reconcilerVersion: renderer.reconcilerVersion || fallback,
      }
      return originalInject(patchedRenderer)
    }
    hook.__patchedSemverInject = true
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
