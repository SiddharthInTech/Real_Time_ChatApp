import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainForm from './component/MainForm';
import ChatRoom from './component/ChatRoom';

function App() {
  return (
      <div  style={{height: "100vh", backgroundColor: "rgba(240, 248, 255, 1)"} } className='container-fluid text-dark d-flex align-items-center justify-content-center'>
            <Router>
              <Routes>
                <Route index element={<MainForm/>}></Route>
                <Route path='/chat/:roomName' element={<ChatRoom/>}></Route>
                <Route path="*" element={<h1>404 not found !</h1>}></Route>
              </Routes>
            </Router>
      </div>
  );
}

export default App;
