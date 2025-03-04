import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Navbar from './components/public/navbar'
import Home from './components/pages/home/home'
import Spend from './components/pages/spend/spend'
import Workout from './components/pages/workout/workout'
import Login from './components/pages/login/login'
import Heatmap from './components/pages/heatmap/heatmap'
import Sensor from './components/pages/sensor/sensor'
import Notes from './components/pages/notes/notes'
// import Message from './components/pages/message/message'
import Playground from './components/pages/playground/playground'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/spend" element={<Spend />}/>
        <Route path="/workout" element={<Workout />}/>
        <Route path="/heatmap" element={<Heatmap />}></Route>
        {/* <Route path="/sensor" element={<Sensor />}></Route> */}
        {/* <Route path="/notes" element={<Notes />}></Route> */}
        {/* <Route path="/message" element={<Message />}></Route> */}
        <Route path="/playground" element={<Playground />}></Route>
      </Routes>
      
    </Router>
  )
}

export default App
