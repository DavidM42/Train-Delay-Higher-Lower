import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	resolve: {
		alias: [
			{ find: 'db-hafas-stations', replacement: path.resolve('src/shims/db-hafas-stations.js') }
		]
	},
	plugins: [sveltekit(), devtoolsJson()]
});
