import Projects from "./pages/Projects";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Projects />
        </>
    );
}

export default App;