import { useEffect, useRef } from 'react'

function checkTime(i) {
  return i < 10 ? '0' + i : i
}

const Clock = () => {
  const clockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function startTime() {
      const today = new Date()
      let h = today.getHours()
      const m = checkTime(today.getMinutes())
      const s = checkTime(today.getSeconds())
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      if (clockRef.current) {
        clockRef.current.innerHTML = `${h}:${m}:${s} ${ampm}`
      }
      setTimeout(startTime, 1000)
    }

    startTime()
  }, [])

  return <div ref={clockRef}>Clock</div>
}

export default Clock
