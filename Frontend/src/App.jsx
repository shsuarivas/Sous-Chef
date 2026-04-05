import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage/MainPage.jsx';
import DefaultHomePage from './DefaultHomePage/DefaultHomePage.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import About from './pages/About/About.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultHomePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}

export default App;