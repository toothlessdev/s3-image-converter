import { createRoot } from "react-dom/client";
import "./tailwind.css";
import App from "./apps/App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
