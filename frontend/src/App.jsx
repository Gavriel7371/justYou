import './App.css';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../src/Pages/Home/Home.jsx';
import Contact from '../src/Pages/Contact/Contact.jsx';
import About from '../src/Pages/About/About.jsx';
import SignUp from '../src/Pages/SignUp/SignUp.jsx';
import SignIn from '../src/Pages/SignIn/SignIn.jsx';
import Header from '../src/Components/Header.jsx';
import Profile from '../src/Pages/Profile/Profile.jsx';
import { createContext, useEffect, useState } from 'react';
import Instructors from './Pages/Instructors/Instructors.jsx';
import InstructorPage from './Pages/InstructorPage/InstructorPage.jsx';
import Management from './Pages/DataManagement/Management.jsx';

export const userContext = createContext();



function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (user) {
        // User is already set
      } else {
        axios
          .get('/backend/user/getUserByToken/' + JSON.parse(localStorage.getItem('token')))
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            console.error(err); // Handle potential errors
            navigate('/signin');
          });
      }
    } else {
      navigate('/signin');
    }
  }, [localStorage.token]);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/About" element={<About />} />
        <Route path="/Instructors" element={<Instructors />} />
        <Route path="/Instructors/:id" element={<InstructorPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Management" element={<Management />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </userContext.Provider>
  );
}

export default App;
