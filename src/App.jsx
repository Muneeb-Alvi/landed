import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Landing from './screens/Landing.jsx'
import Onboarding from './screens/Onboarding.jsx'
import RoadmapScreen from './screens/Roadmap.jsx'
import StepDetail from './screens/StepDetail.jsx'
import { buildRoadmap, stepNotes } from './lib/roadmap.js'
import {
  loadAnswers,
  loadChecked,
  loadFlags,
  loadUpvotes,
  saveAnswers,
  saveChecked,
  saveFlags,
  saveUpvotes,
} from './lib/storage.js'

export default function App() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState(loadAnswers)
  const [checked, setChecked] = useState(loadChecked)
  const [upvotes, setUpvotes] = useState(loadUpvotes)
  const [flags, setFlags] = useState(loadFlags)

  useEffect(() => {
    if (answers) saveAnswers(answers)
  }, [answers])
  useEffect(() => saveChecked(checked), [checked])
  useEffect(() => saveUpvotes(upvotes), [upvotes])
  useEffect(() => saveFlags(flags), [flags])

  const roadmap = useMemo(
    () => (answers?.arrivalDate ? buildRoadmap(answers, { checked }) : null),
    [answers, checked]
  )

  const toggleStep = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }))
  const toggleUpvote = (key) => setUpvotes((u) => ({ ...u, [key]: !u[key] }))
  const toggleFlag = (key) => setFlags((f) => ({ ...f, [key]: !f[key] }))

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Landing
            hasRoadmap={!!roadmap}
            onStart={() => navigate('/onboarding')}
            onResume={() => navigate('/roadmap')}
          />
        }
      />
      <Route
        path="/onboarding"
        element={
          <Onboarding
            initial={answers}
            onCancel={() => navigate('/')}
            onDone={(a) => {
              setAnswers(a)
              navigate('/roadmap')
            }}
          />
        }
      />
      <Route
        path="/roadmap"
        element={
          roadmap ? (
            <RoadmapScreen
              answers={answers}
              roadmap={roadmap}
              onToggle={toggleStep}
              onOpen={(id) => navigate(`/step/${id}`)}
              onEdit={() => navigate('/onboarding')}
            />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />
      <Route
        path="/step/:id"
        element={
          <StepDetailRoute
            roadmap={roadmap}
            answers={answers}
            upvotes={upvotes}
            flags={flags}
            onToggle={{ step: toggleStep, upvote: toggleUpvote, flag: toggleFlag }}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function StepDetailRoute({ roadmap, answers, upvotes, flags, onToggle }) {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!roadmap) return <Navigate to="/onboarding" replace />

  const index = roadmap.steps.findIndex((s) => s.id === id)
  if (index === -1) return <Navigate to="/roadmap" replace />

  const step = roadmap.steps[index]
  const notes = stepNotes(step, answers, upvotes)

  return (
    <StepDetail
      step={step}
      notes={notes}
      upvotes={upvotes}
      flags={flags}
      index={index + 1}
      total={roadmap.steps.length}
      onBack={() => navigate('/roadmap')}
      onToggle={onToggle}
    />
  )
}
