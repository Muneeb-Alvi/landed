import { Component } from 'react'

/**
 * Last line of defence: if a screen throws (for example on hand-edited
 * storage), show a way out instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Landed crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const reset = () => {
      this.setState({ error: null })
      window.location.hash = '#/'
    }
    return (
      <div className="shell">
        <div className="band" role="alert" style={{ padding: '40px var(--gutter)' }}>
          <h1 className="bi on-ink">
            <span className="bi-zh" style={{ color: '#fff' }}>出了点问题</span>
            <span className="bi-en">Something went wrong</span>
          </h1>
          <p style={{ marginTop: 12, fontSize: 14 }}>
            This page could not be shown. Your data is still saved on this device.
          </p>
        </div>
        <div className="section">
          <div className="form-actions">
            <button type="button" className="btn small" onClick={reset}>
              Go home
            </button>
            <button
              type="button"
              className="btn secondary small"
              onClick={() => {
                this.props.onReset?.()
                reset()
              }}
            >
              Clear data and start over
            </button>
          </div>
        </div>
      </div>
    )
  }
}
