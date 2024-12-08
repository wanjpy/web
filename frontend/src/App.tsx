// import './App.css'

import { Link } from "react-router-dom"
import { useRequireAuth } from "./utils/requireAuth"


function App() {
  useRequireAuth()

  return (
    <>
      <Link to="/login" >
        login
      </Link><br />
      <Link to="/caseResult">
        result
      </Link>
    </>
  )
}

export default App
