<script lang="ts">
	import { browser } from '$app/environment';
	import type { RandomConfigs } from '$lib/scripts/types';
	import { RandConfigs } from '$lib/stores/configs.svelte';
	import { PlusIcon, XIcon } from 'lucide-svelte';

	let passwordDisplay: HTMLSpanElement | null = $state(null);
	let inclusions: string[] = [];
	let newPassword: string = $state('');
	let generatedPassword: string = $state('');
	let isPageLoaded: boolean = $state(false);
	let isPasswordCopied: boolean = $state(false);

	let configs = RandConfigs(getSavedConfigs());

	const UPPERCASE_LETTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const LOWERCASE_LETTERS: string = 'abcdefghijklmnopqrstuvwxyz';
	const SYMBOLS: string = "`~!@#$%^&*()_-+=[]{};:'<,.>/?";
	const NUMBERS: string = '1234567890';
	const ALL_CHARACTERS = UPPERCASE_LETTERS + LOWERCASE_LETTERS + SYMBOLS + NUMBERS;

	function getRandomIndex(size: number) {
		return Math.floor(Math.random() * size);
	}
	function getRandomCharacter(group: string | any[]) {
		return group[getRandomIndex(group.length)];
	}

	function getRandomPassword() {
		inclusions = [];
		inclusions.push(UPPERCASE_LETTERS, LOWERCASE_LETTERS);

		if (configs.value.includesNumbers) {
			inclusions.push(NUMBERS);
		}
		if (configs.value.includesSymbols) {
			inclusions.push(SYMBOLS);
		}

		let newPasswordArray: string[] = [];
		for (let index = 0; index < configs.value.passwordLength; index++) {
			// Get a random item from the inclusions array
			let randomLookup = inclusions[getRandomIndex(inclusions.length)];
			let randomCharacter = getRandomCharacter(randomLookup);
			newPasswordArray.push(randomCharacter);
		}

		newPassword = newPasswordArray.join('');

		revealPassword();
	}
	function revealPassword() {
		let iteration: number = -5;

		if (passwordDisplay) {
			const interval = setInterval(() => {
				const passwordArray = newPassword.split('');
				/*passwordDisplay.innerText*/
				generatedPassword = passwordArray
					.map((character, index) => {
						return index < iteration
							? character
							: getRandomCharacter(inclusions[getRandomIndex(inclusions.length)]);
					})
					.join('');

				if ((iteration += 1) > configs.value.passwordLength) {
					clearInterval(interval);
				}
			}, 100);
		}
	}
	function copyPassword() {
		if (browser) {
			navigator.clipboard.writeText(generatedPassword);
			isPasswordCopied = true;
			setTimeout(() => {
				isPasswordCopied = false;
			}, 500);
		}
	}

	function getSavedConfigs(): RandomConfigs {
		let defaultConfigs: RandomConfigs = {
			passwordLength: 8,
			includesNumbers: false,
			includesSymbols: false
		};

		if (localStorage) {
			if (browser) {
				let savedConfigs = localStorage.getItem(`randomConfigs`);

				if (savedConfigs) {
					return JSON.parse(savedConfigs);
				}
			}

			localStorage.setItem('randomConfigs', JSON.stringify(defaultConfigs));
		}

		return defaultConfigs;
	}
	// $inspect(generatedPassword);
</script>

<header>
	<div class="logo-container"></div>
	<button class="btn">how it works</button>
</header>

<main>
	<div class="container">
		<div class="title">
			<h1>random</h1>
		</div>

		{@render Generator()}
	</div>
</main>

{#snippet Generator()}
	<div class="generator">
		<output class="password-display">
			<span bind:this={passwordDisplay}>{generatedPassword}</span>
			<div class="copier">
				<button class="btn copy" aria-label="copy" onclick={copyPassword}>
					<!-- TODO: Test this click event -->
					<small aria-hidden="true">copy</small>
				</button>
			</div>
		</output>

		<div class="controls">
			<button class="btn generate" onclick={getRandomPassword}>generate</button>

			<details class="configs">
				<summary>
					<p>configure</p>

					<span class="icon">
						<div class="closed">
							<PlusIcon size={20} />
						</div>
						<div class="open">
							<XIcon size={20} />
						</div>
					</span>
				</summary>

				<div class="content">
					<label class="config-label" for="length">
						<div class="label-container">
							<p>length</p>
							<small>{configs.value.passwordLength}</small>
						</div>

						<input
							type="range"
							name="length"
							id="length"
							class="length-slider"
							min="6"
							max="24"
							bind:value={configs.value.passwordLength}
						/>
					</label>

					<label class="config-label" for="include-numbers">
						<input
							type="checkbox"
							name="include-numbers"
							id="include-numbers"
							bind:checked={configs.value.includesNumbers}
						/>
						<span>include numbers</span>
					</label>

					<label for="include-symbols" class="config-label">
						<input
							type="checkbox"
							name="include-symbols"
							id="include-symbols"
							bind:checked={configs.value.includesSymbols}
						/>
						<span>include symbols</span>
					</label>
				</div>
			</details>
		</div>
	</div>
{/snippet}

<style>
	/* HEADER */
	header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem /* 12px */;
		padding: 1.5rem /* 24px */;
	}
	.logo-container {
		width: 2rem /* 32px */;
		height: 2rem /* 32px */;
		aspect-ratio: 1;
		background: var(--clr-neutral-800);
	}

	/* MAIN */
	main {
		min-height: 80svh;
		padding-inline: 3rem /* 48px */;

		& > .container {
			width: 100%;
			max-width: 37.5rem /* 600px */;
			display: flex;
			flex-direction: column;
			gap: 1.5rem /* 24px */;
			margin-inline: auto;
		}
	}
	.title {
		text-align: center;
	}

	/* ======= Generator ======== */
	.generator {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem /* 24px */;
	}
	.password-display {
		text-align: center;
		font-size: var(--fs-md);
		padding-inline: 1.5rem /* 24px */;
		padding-block: 3rem /* 48px */;
		border: 2px solid var(--clr-neutral-800);
		border-radius: 1.5rem /* 24px */;
		position: relative;

		& > span {
			display: block;
			height: 1.5rem /* 24px */;
		}

		& > .copier {
			display: grid;
			position: absolute;
			inset-inline-end: 0.75rem /* 12px */;
			inset-block-start: 0.75rem /* 12px */;
			opacity: 0;
			visibility: hidden;
		}

		&:hover {
			& > .copier {
				opacity: 1;
				visibility: visible;
			}
		}
	}

	.controls {
		display: grid;
		gap: 1.5rem /* 24px */;

		& > .btn.generate {
			color: var(--clr-neutral-800);
			padding-inline: 3rem /* 48px */;
			padding-block: 1rem;
			background: var(--clr-white);
		}
	}
	details.configs {
		border-radius: 1.5rem /* 24px */;
		background: var(--clr-neutral-800);
		overflow: hidden;

		& > summary {
			display: grid;
			grid-template-columns: 1fr auto;
			padding: 1rem;
			cursor: pointer;

			& > .icon {
				color: var(--clr-neutral-500);
				display: inline-grid;

				& > div {
					grid-column-start: 1;
					grid-row-start: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			&::marker {
				content: '';
				/* list-style: none; */
				/* display: none; */
			}
		}

		&:not([open]) {
			& span.icon > .open {
				opacity: 0;
			}
		}
		&[open] {
			& > summary {
				color: var(--clr-white);
				background: var(--clr-neutral-700);
			}
			& span.icon > .closed {
				opacity: 0;
			}
		}

		& > .content {
			display: grid;
			gap: 0.75rem /* 12px */;
			padding: 1.5rem /* 24px */;
		}
	}

	.label-container {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.75rem /* 12px */;
	}

	.length-slider {
		width: 100%;
		display: block;
	}
</style>
