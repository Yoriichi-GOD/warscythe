import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const TestRealm = import.meta.env.DEV
  ? React.lazy(() => import('./components/dev/TestRealm.jsx'))
  : null

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {TestRealm && (
      <Suspense fallback={null}>
        <TestRealm />
      </Suspense>
    )}
  </React.StrictMode>,
)
