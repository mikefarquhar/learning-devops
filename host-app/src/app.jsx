import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "./home";
import { About } from "./about";
import { NotFound } from "./not-found";

export function App() {
    return (
        <>
            <p>React mounted</p>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}
