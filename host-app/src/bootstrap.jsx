import { createRoot } from "react-dom/client";
import { App } from "./app";

const appContainer = document.getElementById("app");
const root = createRoot(appContainer);

root.render(<App />);
