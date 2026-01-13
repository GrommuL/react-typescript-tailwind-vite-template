import { createRoot } from 'react-dom/client'

import './main.css'

import { AppEntry } from './app-entry'

const rootContainer = document.getElementById('root')

if (!rootContainer) {
	throw new Error('Root container element with id "root" not found in the DOM.')
}

const root = createRoot(rootContainer)

root.render(<AppEntry />)
