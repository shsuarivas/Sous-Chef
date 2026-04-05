import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage/MainPage.jsx';
import DefaultHomePage from './DefaultHomePage/DefaultHomePage.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import About from './pages/About/About.jsx';

import HomePage from './MainPage/pages/HomePage/HomePage.jsx';
import ExplorePage from './MainPage/pages/ExplorePage/ExplorePage.jsx';
import SettingsPage from './MainPage/pages/SettingsPage/SettingsPage.jsx';
import NotificationsPage from './MainPage/pages/NotificationsPage/NotificationsPage.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultHomePage />} />
            <Route path="/main" element={<MainPage />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}

export default App;