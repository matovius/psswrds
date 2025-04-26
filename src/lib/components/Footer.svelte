<script lang="ts">
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let isLoaded: boolean = $state(false);
	onMount(() => {
		isLoaded = true;
	});
</script>

{#if isLoaded}
	<footer transition:fade={{ delay: 1500, duration: 200, easing: quadOut }}>
		<small
			>Orchestrated by <a
				href="http://matovius.pages.dev"
				target="_blank"
				rel="noopener noreferrer"
				class="external-link">@matovius</a
			></small
		>
	</footer>
{/if}

<style>
	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 3rem /* 48px */;

		& .external-link {
			text-decoration: underline solid transparent;
			color: var(--clr-neutral-500);
			outline: 2px solid transparent;
			outline-offset: 4px;

			&:is(:hover, :focus) {
				text-decoration-color: var(--clr-neutral-500);
			}

			&:focus-visible {
				outline-color: var(--clr-white);
			}
		}

		&:hover {
			& .external-link {
				color: var(--clr-white);
			}
		}
	}
</style>
