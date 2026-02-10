import { Routes, Route } from "react-router";
import App from '../src/App';
import SignInUp from '../src/routes/SignInUp';
import SignIn from '../src/routes/SignIn';
import Blog from '../src/routes/Blog';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-in-up" element={<SignInUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/blog" element={<Blog />} />
        </Routes>
    )
}

export default AppRoutes