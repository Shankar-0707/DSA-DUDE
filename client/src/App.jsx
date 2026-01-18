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
import Visualize from "./pages/Visualize"
import Upload from "./pages/pdf_qna_tool/Upload";
import DoucmentView from "./pages/pdf_qna_tool/DoucmentView";
import Historypage from "./pages/pdf_qna_tool/Historypage";
import Quiz from "./pages/Quiz/Quiz";
import QuizLevel from "./pages/Quiz/QuizLevel";
import QuizPlay from "./pages/Quiz/QuizPlay";
import QuizResult from "./pages/Quiz/QuizResult";

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
          <Route path="/visualize" element={<ProtectedRoute> <Visualize /></ProtectedRoute>} />
          <Route path="/document/:id" element={<ProtectedRoute> <DoucmentView /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute> <Upload /></ProtectedRoute>} />
          <Route path="/documents/history" element={<ProtectedRoute> <Historypage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute> <Quiz /></ProtectedRoute>} />
          <Route path="/quiz/:topic" element={<ProtectedRoute> <QuizLevel /></ProtectedRoute>} />
          <Route path="/quiz/:topic/:level" element={<ProtectedRoute> <QuizPlay /></ProtectedRoute>} />
          <Route path="/quiz/:topic/:level/result" element={<ProtectedRoute> <QuizResult /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App