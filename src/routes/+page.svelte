<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';

	let isPageLoaded: boolean = $state(false);

	onMount(() => {
		isPageLoaded = true;
	});
</script>

<svelte:head>
	<title>psswrd - Generate passwords as random characters or diceware words</title>
</svelte:head>

{#if isPageLoaded}
	<header transition:fly={{ duration: 500, easing: quadOut, x: 0, y: '-24px', opacity: 0 }}>
		<div class="icon">
			<Logo />
		</div>
		<h5 class="title">psswrds</h5>
	</header>

	<main transition:fade={{ delay: 1000, duration: 500, easing: quadOut }}>
		<ul class="generators">
			<li>
				<a href="/random" class="card random" aria-label="random character generator">
					<span class="h4 title" aria-hidden="true">random</span>
				</a>
			</li>
			<li>
				<a href="/random" class="card diceware new" aria-label="diceware word generator">
					<span class="h4 title" aria-hidden="true">diceware</span>
				</a>
			</li>
		</ul>
	</main>
{/if}

<style>
	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.5rem /* 24px */;
		padding: 3rem /* 48px */;

		& > .icon {
			width: 6rem /* 96px*/;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		& > .title {
			color: var(--clr-neutral-500);
		}
	}

	main {
		padding-inline: 3rem /* 48px */;
	}

	.generators {
		list-style: none;
		width: 100%;
		max-width: 30rem /* 480px */;
		display: grid;
		/* grid-template-columns: 1fr 1fr; */
		gap: 1.5rem /* 24px */;
		margin-inline: auto;
	}

	.card {
		text-decoration: none;
		color: var(--clr-neutral-500);
		width: 100%;
		min-height: 12.5rem /* 200px */;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1.5rem /* 24px */;
		border-radius: 1.5rem /* 24px */;
		background: color-mix(in oklab, var(--clr-neutral-800), transparent 50%);
		z-index: 1;
		outline: 2px solid transparent;
		outline-offset: 2px;

		&:is(:hover, :focus) {
			color: var(--clr-white);
			background: var(--clr-neutral-800);
			transform: scale(1.05);
			z-index: 2;
		}

		&:focus-visible {
			outline-color: var(--clr-white);
		}

		/* Applied to new generators */
		&.new {
			position: relative;

			&::after {
				content: 'new';
				font-size: var(--fs-sm);
				color: var(--clr-black);
				padding: 4px 12px;
				border-radius: 9999rem;
				background: var(--clr-white);
				position: absolute;
				inset-block-start: 0.75rem /* 12px */;
				inset-inline-end: 0.75rem /* 12px */;
				pointer-events: none;
				user-select: none;
			}
		}
	}
</style>
