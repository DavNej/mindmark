import React from 'react'
import useD3 from './hooks/use-d3'

import builder from './builders/tree'

import './index.css'

export default function App() {
  const { build, unmout } = useD3(builder, { height: 1200 })

  React.useEffect(() => {
    build()
    return () => unmout()
  })

  return null
}
