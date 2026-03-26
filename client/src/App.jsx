import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./features/landing/Landing";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/Login";
import Home from "./features/home/Home";
import Problem from "./features/approaches/Problem";
import AIProblem from "./features/approaches/AIProblem";
import ManualProblem from "./features/approaches/ManualProblem";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedProblems from "./features/problems/SavedProblems";
import SavedProblemDetails from "./features/problems/SavedProblemDetails";
import { Toaster } from "react-hot-toast";
import Profile from "./features/user/Profile";
import Visualize from "./features/visualize/Visualize"
import Upload from "./features/pdf/Upload";
import DoucmentView from "./features/pdf/DocumentView";
import Historypage from "./features/pdf/HistoryPage";
import Quiz from "./features/quiz/Quiz";
import QuizLevel from "./features/quiz/QuizLevel";
import QuizPlay from "./features/quiz/QuizPlay";
import QuizResult from "./features/quiz/QuizResult";

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