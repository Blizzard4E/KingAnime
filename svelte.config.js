import adapter from '@sveltejs/adapter-auto';
import preprocessor from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocessor({scss: { prependData: `@import './src/styles/theme.scss';` }}),
	kit: {
		adapter: adapter()
	}
};

export default config;
