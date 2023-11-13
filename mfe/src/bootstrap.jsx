import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import About from "./About";

const rootEl = document.getElementById("app");
const root = createRoot(rootEl);
root.render(
    <Router>
        <About />
    </Router>,
);
