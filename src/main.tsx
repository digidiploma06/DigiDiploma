import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Site design system: loads after index.css so it wins equal-specificity ties
import './styles/dd-theme.css'

createRoot(document.getElementById("root")!).render(<App />);
