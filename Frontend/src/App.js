import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainForm from './component/MainForm';
import ChatRoom from './component/ChatRoom';

function App() {
  return (
      <div  style={{height: "100vh", backgroundImage: "url('https://external-preview.redd.it/tGqyYypz281IbaiOKNG_ru6lvTze1HhAYYXCRpw9CO8.jpg?auto=webp&s=fb831204065bc518b1f815ae79f904871d743efd')"} } className='container-fluid text-dark d-flex align-items-center justify-content-center'>
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
