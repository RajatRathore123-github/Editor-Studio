import Home from "./pages/Home"
import EditorPg from "./pages/EditorPg"
import './App.css';
import {Toaster} from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <>
    <div>
      <Toaster
      position="top-center"
      toastOptions={{
        success:{
          theme:{
            primary: "deepskyblue"
          }
        }
      }}/>
        
    </div>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/editor/:roomId" element={<EditorPg/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
