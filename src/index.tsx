import {createRoot} from "react-dom/client";
import "tailwindcss/tailwind.css";
import {App} from "@/App";

const container = document.getElementById("content") as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
