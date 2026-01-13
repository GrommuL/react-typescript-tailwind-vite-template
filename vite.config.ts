import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'VITE_')

	return {
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler']]
				}
			}),
			tailwindcss()
		],
		resolve: { alias: { '@': path.resolve(__dirname, './src') } }
	}
})
