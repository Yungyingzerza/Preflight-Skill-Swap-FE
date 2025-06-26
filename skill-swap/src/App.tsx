import { Route, Routes } from "react-router-dom";
import Home from "@pages/Home"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1 className="text-8xl">?</h1>} />
      </Routes>
    </>
  )
}

export default App
