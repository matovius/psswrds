import type { RandomConfigs } from '$lib/scripts/types';

export function RandConfigs(initial: RandomConfigs) {
	let currentConfigs = $state(initial);

	return {
		get value() {
			return currentConfigs;
		},
		set: (newConfigs: RandomConfigs) => {
			currentConfigs = newConfigs;
		}
	};
}
