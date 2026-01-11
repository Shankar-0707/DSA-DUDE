import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Problem from "./pages/Problem";
import AIProblem from "./pages/AIProblem";
import ManualProblem from "./pages/ManualProblem";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedProblems from "./pages/SavedProblems";
import SavedProblemDetails from "./pages/SavedProblemDetails";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <Problem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/ai"
            element={
              <ProtectedRoute>
                <AIProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/manual"
            element={
              <ProtectedRoute>
                <ManualProblem />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>} />
          <Route path="/saved-problems" element={<ProtectedRoute> <SavedProblems /></ProtectedRoute>} />
          <Route path="/saved-problem/:id" element={<ProtectedRoute> <SavedProblemDetails /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App