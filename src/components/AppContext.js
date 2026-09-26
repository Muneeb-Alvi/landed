import { createContext, useContext, useEffect } from 'react'

/** App-wide settings the chrome needs: language, menu targets, start over. */
export const AppContext = createContext({
  lang: 'both',
  setLang: () => {},
  hasRoadmap: false,
  go: () => {},
  startOver: () => {},
})

export const useApp = () => useContext(AppContext)

const SITE = 'Landed 落地清华'

/** Per-route document title: "My roadmap · Landed 落地清华". */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE
  }, [title])
}
