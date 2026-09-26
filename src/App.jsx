import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Landing from './screens/Landing.jsx'
import Onboarding from './screens/Onboarding.jsx'
import RoadmapScreen from './screens/Roadmap.jsx'
import StepDetail from './screens/StepDetail.jsx'
import { AppContext } from './components/AppContext.js'
import { Loading, Toast } from './components/Chrome.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { buildRoadmap, newCustomId, stepNotes } from './lib/roadmap.js'
import { clearAll, defaultFor, useStored } from './lib/storage.js'
import { toISODay, today } from './lib/date.js'

// Tools off the main path load on demand.
const CheckDocument = lazy(() => import('./screens/CheckDocument.jsx'))
const About = lazy(() => import('./screens/About.jsx'))

const HTML_LANG = { zh: 'zh-CN', en: 'en', both: 'zh-CN' }

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
  const [followUps, setFollowUps] = useStored('followUps')
  const [tips, setTips] = useStored('tips')
  const [docs, setDocs] = useStored('docs')
  const [lang, setLang] = useStored('lang')

  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const html = document.documentElement
    html.dataset.lang = lang
    html.lang = HTML_LANG[lang] || 'zh-CN'
  }, [lang])

  const [toast, setToast] = useState(null)
  const toastSeq = useRef(0)
  const showToast = useCallback((t) => setToast({ ...t, id: ++toastSeq.current }), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const roadmap = useMemo(
    () =>
      answers?.arrivalDate
        ? buildRoadmap(answers, { checked, hidden, due, custom, followUps })
        : null,
    [answers, checked, hidden, due, custom, followUps]
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
    toggleDoc: toggle(setDocs),
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
    answerFollowUp(key, value) {
      setFollowUps((f) => (value === undefined ? without(f, key) : { ...f, [key]: value }))
    },
    addTip(stepId, fields) {
      const tip = { id: newCustomId().replace('custom', 'tip'), date: toISODay(today()), ...fields }
      setTips((t) => ({ ...t, [stepId]: [...(t[stepId] || []), tip] }))
      showToast({ zh: '已保存在此设备', en: 'Tip saved on this device' })
    },
    deleteTip(stepId, tipId) {
      const list = tips[stepId] || []
      const index = list.findIndex((x) => x.id === tipId)
      const removed = list[index]
      if (!removed) return
      setTips((t) => ({ ...t, [stepId]: (t[stepId] || []).filter((x) => x.id !== tipId) }))
      showToast({
        zh: '已删除',
        en: 'Tip deleted',
        action: {
          zh: '撤销',
          en: 'Undo',
          run: () =>
            setTips((t) => {
              const next = [...(t[stepId] || [])]
              next.splice(index, 0, removed)
              return { ...t, [stepId]: next }
            }),
        },
      })
    },
    setMyNote(id, text) {
      setMyNotes((n) => (text ? { ...n, [id]: text } : without(n, id)))
    },
  }

  const startOver = () => {
    clearAll()
    const resets = [
      [setAnswers, 'answers'],
      [setChecked, 'checked'],
      [setUpvotes, 'upvotes'],
      [setFlags, 'flags'],
      [setHidden, 'hidden'],
      [setDue, 'due'],
      [setCustom, 'custom'],
      [setMyNotes, 'myNotes'],
      [setFollowUps, 'followUps'],
      [setTips, 'tips'],
      [setDocs, 'docs'],
    ]
    resets.forEach(([set, name]) => set(defaultFor(name)))
    navigate('/')
    showToast({ zh: '已清除所有数据', en: 'All data cleared from this device' })
  }

  const context = {
    lang,
    setLang,
    hasRoadmap: !!roadmap,
    go: (to) => navigate(to),
    startOver,
  }

  return (
    <AppContext.Provider value={context}>
      <ErrorBoundary onReset={startOver}>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              hasRoadmap={!!roadmap}
              onStart={(persona) =>
                navigate(persona ? `/onboarding?persona=${persona}` : '/onboarding')
              }
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
                docs={docs}
                actions={actions}
                onOpen={(id) => navigate(`/step/${id}`)}
                onEdit={() => navigate('/onboarding')}
                onCheck={() => navigate('/check')}
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
              followUps={followUps}
              tips={tips}
              actions={actions}
            />
          }
        />
        <Route
          path="/check"
          element={<CheckDocument onBack={() => navigate(roadmap ? '/roadmap' : '/')} />}
        />
        <Route
          path="/about"
          element={<About onBack={() => navigate(roadmap ? '/roadmap' : '/')} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
      <Toast toast={toast} onDismiss={dismissToast} />
    </AppContext.Provider>
  )
}

function StepDetailRoute({ roadmap, answers, upvotes, flags, myNotes, followUps, tips, actions }) {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!roadmap) return <Navigate to="/onboarding" replace />

  const index = roadmap.steps.findIndex((s) => s.id === id)
  const hiddenStep = roadmap.hiddenSteps.find((s) => s.id === id)
  const skippedStep = roadmap.skippedSteps.find((s) => s.id === id)
  const step = index >= 0 ? roadmap.steps[index] : hiddenStep || skippedStep
  if (!step) return <Navigate to="/roadmap" replace />

  return (
    <StepDetail
      step={step}
      isHidden={!!hiddenStep}
      isSkipped={!!skippedStep}
      answers={answers}
      followUps={followUps}
      getNotes={(sort) => stepNotes(step, answers, upvotes, tips[step.id] || [], sort)}
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
