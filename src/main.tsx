import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Redesign styles must load after index.css so they win equal-specificity ties
import './styles/dd-theme.css'
import './styles/dd-skin.generated.css'
import './styles/dd-skin.css'

createRoot(document.getElementById("root")!).render(<App />);
