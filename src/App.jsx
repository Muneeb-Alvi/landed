import { useCallback, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Landing from './screens/Landing.jsx'
import Onboarding from './screens/Onboarding.jsx'
import RoadmapScreen from './screens/Roadmap.jsx'
import StepDetail from './screens/StepDetail.jsx'
import { Toast } from './components/Chrome.jsx'
import { buildRoadmap, newCustomId, stepNotes } from './lib/roadmap.js'
import { useStored } from './lib/storage.js'

export default function App() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useStored('answers')
  const [checked, setChecked] = useStored('checked')
  const [upvotes, setUpvotes] = useStored('upvotes')
  const [flags, setFlags] = useStored('flags')
  const [hidden, setHidden] = useStored('hidden')
  const [due, setDue] = useStored('due')
  const [custom, setCustom] = useStored('custom')
  const [myNotes, setMyNotes] = useStored('myNotes')

  const [toast, setToast] = useState(null)
  const toastSeq = useRef(0)
  const showToast = useCallback((t) => setToast({ ...t, id: ++toastSeq.current }), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const roadmap = useMemo(
    () =>
      answers?.arrivalDate ? buildRoadmap(answers, { checked, hidden, due, custom }) : null,
    [answers, checked, hidden, due, custom]
  )

  const toggle = (setter) => (key) => setter((m) => ({ ...m, [key]: !m[key] }))
  const without = (m, key) => {
    const next = { ...m }
    delete next[key]
    return next
  }

  const actions = {
    toggleStep: toggle(setChecked),
    toggleUpvote: toggle(setUpvotes),
    toggleFlag: toggle(setFlags),

    hideStep(step) {
      setHidden((h) => ({ ...h, [step.id]: true }))
      showToast({
        zh: '已隐藏',
        en: `Hidden: ${step.titleEn}`,
        action: { zh: '撤销', en: 'Undo', run: () => setHidden((h) => without(h, step.id)) },
      })
    },
    restoreStep(id) {
      setHidden((h) => without(h, id))
    },
    setDue(id, iso) {
      setDue((d) => (iso ? { ...d, [id]: iso } : without(d, id)))
    },
    addCustom(fields) {
      const step = { id: newCustomId(), ...fields }
      setCustom((list) => [...list, step])
      showToast({ zh: '已添加', en: `Added: ${fields.title}` })
    },
    updateCustom(id, patch) {
      setCustom((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    deleteCustom(id) {
      const index = custom.findIndex((c) => c.id === id)
      const removed = custom[index]
      if (!removed) return
      setCustom((list) => list.filter((c) => c.id !== id))
      showToast({
        zh: '已删除',
        en: `Deleted: ${removed.title}`,
        action: {
          zh: '撤销',
          en: 'Undo',
          run: () =>
            setCustom((list) => {
              const next = [...list]
              next.splice(index, 0, removed)
              return next
            }),
        },
      })
    },
    setMyNote(id, text) {
      setMyNotes((n) => (text ? { ...n, [id]: text } : without(n, id)))
    },
  }

  return (
    <>
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
                actions={actions}
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
              myNotes={myNotes}
              actions={actions}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  )
}

function StepDetailRoute({ roadmap, answers, upvotes, flags, myNotes, actions }) {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!roadmap) return <Navigate to="/onboarding" replace />

  const index = roadmap.steps.findIndex((s) => s.id === id)
  const step = index >= 0 ? roadmap.steps[index] : roadmap.hiddenSteps.find((s) => s.id === id)
  if (!step) return <Navigate to="/roadmap" replace />

  return (
    <StepDetail
      step={step}
      isHidden={index < 0}
      notes={stepNotes(step, answers, upvotes)}
      upvotes={upvotes}
      flags={flags}
      myNote={myNotes[step.id] || ''}
      index={index + 1}
      total={roadmap.steps.length}
      onBack={() => navigate('/roadmap')}
      actions={actions}
      onHide={() => {
        actions.hideStep(step)
        navigate('/roadmap')
      }}
      onDelete={() => {
        actions.deleteCustom(step.id)
        navigate('/roadmap')
      }}
    />
  )
}
