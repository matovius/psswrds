import { browser } from '$app/environment';
import type { Configs } from '$lib/scripts/types';
import { writable, type Writable } from 'svelte/store';

export const SavedConfigs: Writable<Configs> = writable<Configs>(getSavedConfigs());

function getSavedConfigs(): Configs {
	let savedConfigs: Configs;

	if (browser) {
		const storedData = localStorage.getItem('configs');

		if (storedData !== undefined && storedData !== null) {
			savedConfigs = JSON.parse(storedData);
			return savedConfigs;
		}
	}
	return setDefaultConfigs();
}

function setDefaultConfigs(): Configs {
	const defaultConfigs: Configs = {
		passwordLength: 8,
		includesNumbers: false,
		includesSymbols: false
	};

	if (browser) {
		localStorage.setItem('configs', JSON.stringify(defaultConfigs));
	}
	return defaultConfigs;
}
