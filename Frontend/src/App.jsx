import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage/MainPage.jsx';
import DefaultHomePage from './DefaultHomePage/DefaultHomePage.jsx';
import AboutPage from './AboutPage/AboutPage.jsx';
import SignInPage from './SignInPage/SignInPage.jsx';
import SignUpPage from './SignUpPage/SignUpPage.jsx';

/*
	This container will choose between the website view and the recipe cooking view
*/

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DefaultHomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
	)
}

export default App;