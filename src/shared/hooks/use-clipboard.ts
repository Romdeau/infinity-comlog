import * as React from "react"

export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = React.useState(false)
  const resetTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const copyText = React.useCallback(async (value: string) => {
    if (!value) return false
    if (!navigator.clipboard?.writeText) return false

    await navigator.clipboard.writeText(value)
    setCopied(true)

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false)
      resetTimerRef.current = null
    }, resetDelay)

    return true
  }, [resetDelay])

  return { copied, copyText }
}
