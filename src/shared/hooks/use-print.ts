import * as React from "react"

export function usePrint() {
  return React.useCallback(() => {
    window.print()
  }, [])
}
