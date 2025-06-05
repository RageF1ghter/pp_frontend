// import './App.css'
import Navbar from './components/public/navbar'
import Home from './components/pages/home/home'
import Spend from './components/pages/spend/spend'
import Login from './components/pages/login/login'
import Heatmap from './components/pages/heatmap/heatmap'
import Sensor from './components/pages/sensor/sensor'
import Notes from './components/pages/notes/notes'
// import Message from './components/pages/message/message'
import Playground from './components/pages/playground/playground'
import Calendar from './components/pages/workout/calendar'
import Recording from './components/pages/workout/recording'
import Details from './components/pages/workout/details'
import Jobs from './components/pages/jobs/jobs'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react"
import {jwtDecode} from 'jwt-decode';
import { login } from './redux/authSlice';

function App() {
  const isLoggedIn = useSelector((state) => state.auth.status);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const decodedJwt = jwtDecode(jwt);
      console.log('Decoded JWT:', decodedJwt);
      // updateState(decodedJwt)
      dispatch(login({
        userId: decodedJwt.id,
        username: decodedJwt.username,
        email: decodedJwt.email,
        status: true
      }));
    }
  },[])
  // const username = useSelector((state) => state.auth.username);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex flex-col gap-20">
          <Navbar/>
          <div>
            <Routes>
              <Route path="/home/:username" element={<Home />} />
              <Route path="/spend" element={<Spend />} />
              
              <Route path="/heatmap" element={<Heatmap />}></Route>
              <Route path="/sensor" element={<Sensor />}></Route>
              <Route path="/notes" element={<Notes />}></Route>
              
              <Route path="/playground/*" element={<Playground />}></Route>
              <Route path="/calendar" element={<Calendar />}></Route>
              <Route path='/recording' element={<Recording />}></Route>
              <Route path='/details/*' element={<Details />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/jobs' element={<Jobs />}></Route>
              <Route path='*' element={<Login />}></Route>
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

export default App;
