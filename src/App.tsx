import React from 'react'
import useD3 from './hooks/use-d3'

import builder from './builders/tree'
// import { tree as builder } from './builders'

import './index.css'

export default function App() {
  const { build, unmout } = useD3(builder)

  React.useEffect(() => {
    build()
    return () => unmout()
  })

  return null
}
