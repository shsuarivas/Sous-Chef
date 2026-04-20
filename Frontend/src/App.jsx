import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage/MainPage.jsx';
import DefaultHomePage from './DefaultHomePage/DefaultHomePage.jsx';
import AboutPage from './AboutPage/AboutPage.jsx';
import SignInPage from './SignInPage/SignInPage.jsx';
import SignUpPage from './SignUpPage/SignUpPage.jsx';
import HomePage from './MainPage/pages/HomePage/HomePage.jsx';
import ExplorePage from './MainPage/pages/ExplorePage/ExplorePage.jsx';
import NotificationsPage from './MainPage/pages/NotificationsPage/NotificationsPage.jsx';
import SettingsPage from './MainPage/pages/SettingsPage/SettingsPage.jsx';
import GeminiTest from './GeminiTest/GeminiTest.jsx';
import RecipePage from './MainPage/pages/RecipePage/RecipePage.jsx';
import CookingPage from './CookingPage/CookingPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DefaultHomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/main" element={<MainPage />}>
                    <Route index element={<HomePage />} />
                    <Route path="explore" element={<ExplorePage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="recipe/:id" element={<RecipePage />} />
                </Route>
                <Route path="/cook/:id" element={<CookingPage />} />
                <Route path="/geminitest" element={<GeminiTest />} />
            </Routes>
        </Router>
    )
}

export default App;
