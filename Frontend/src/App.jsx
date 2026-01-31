import { useState } from 'react'
import Template from './Template.jsx'
import Homepage from './Homepage.jsx'

function App() {
  const [showHomepage, setShowHomepage] = useState(false);

  return (
    <>
    { showHomepage ? 
      (<Homepage />) : 
      (<Template goToHomepage={() => setShowHomepage(true)}/>) }
    </>
  )
}

export default App