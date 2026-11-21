import './styles/main.css'
import './styles/typography.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Entry from './components/Entry.jsx'
import MotionEnvironment from './motion/MotionEnvironment.jsx'

const TestRealm = import.meta.env.DEV
  ? React.lazy(() => import('./components/dev/TestRealm.jsx'))
  : null

const FitnessV2Harness = import.meta.env.DEV
  ? React.lazy(() => import('./features/fitness-v2/dev/FitnessV2Harness.jsx'))
  : null

const showFitnessV2Harness = Boolean(
  FitnessV2Harness && new URLSearchParams(window.location.search).get('fitnessV2Harness') === '1'
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionEnvironment>
    {showFitnessV2Harness ? (
      <Suspense fallback={null}>
        <FitnessV2Harness />
      </Suspense>
    ) : <Entry />}
    {!showFitnessV2Harness && TestRealm && (
      <Suspense fallback={null}>
        <TestRealm />
      </Suspense>
    )}
    </MotionEnvironment>
  </React.StrictMode>,
)
