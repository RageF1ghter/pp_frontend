// import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useSelector } from 'react-redux'
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
import Calendar from './components/pages/calendar/calendar'
import Recording from './components/pages/calendar/recording'
import Details from './components/pages/calendar/details'

function App() {
  const isLoggedIn = useSelector((state) => state.auth.status);
  // const username = useSelector((state) => state.auth.username);
  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex flex-col min-h-screen m-10">
          <Navbar/>
          <div className="flex-1 px-4 py-6">
            <Routes>
              <Route path="/home/:username" element={<Home />} />
              <Route path="/spend" element={<Spend />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/heatmap" element={<Heatmap />}></Route>
              {/* <Route path="/sensor" element={<Sensor />}></Route> */}
              {/* <Route path="/notes" element={<Notes />}></Route> */}
              {/* <Route path="/message" element={<Message />}></Route> */}
              <Route path="/playground/*" element={<Playground />}></Route>
              <Route path="/calendar" element={<Calendar />}></Route>
              <Route path='/recording' element={<Recording />}></Route>
              <Route path='/details/*' element={<Details />}></Route>
            </Routes>
          </div>
          
        </div>
      ) : (
        <div>
          <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='*' element={<Login />}></Route>
          </Routes>
        </div>

      )}


    </Router>
  )
}

export default App
