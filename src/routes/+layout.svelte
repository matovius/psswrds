<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children()}

<Footer />
