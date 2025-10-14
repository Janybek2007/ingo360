import '../shared/assets/fonts/fonts.css';
import './styles/app.css';

import { createRoot } from 'react-dom/client';

import { BootstrappedRouter } from './browser-router';

createRoot(document.getElementById('root')!).render(<BootstrappedRouter />);
