import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Problem from "./pages/Problem";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/problem/:id" element={<Problem />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App