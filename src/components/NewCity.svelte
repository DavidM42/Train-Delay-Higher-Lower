<script lang="ts">
	import { cubicInOut, cubicOut } from "svelte/easing";
	import fadeScale from "../aesthetic/fade-scale";

	import { Decision } from "../typing/types";

	export let city: string;
	export let delay: number;
	export let imgLink: string;
	export let chooseActive: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function higher(node) {
		dispatch("message", { decision: Decision.HIGHER });
		chooseActive = false;
	}
	function lower(node) {
		dispatch("message", { decision: Decision.LOWER });
		chooseActive = false;
	}
</script>

<main
	style="background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
url('{imgLink}') no-repeat center center fixed;"
>
	<h1>{city}</h1>

	{#if !chooseActive}
		<div
			class="term-volume"
			transition:fadeScale={{
				delay: 75,
				duration: 500,
				easing: cubicInOut,
				baseScale: 0.5,
			}}
		>
			<p class="term-volume__volume">{delay}</p>
			<p>Minuten Verspätung</p>
		</div>
	{:else}
		<div
			class="buttonContainer"
			transition:fadeScale={{
				delay: 75,
				duration: 500,
				easing: cubicOut,
				baseScale: 0.5,
			}}
		>
			<button on:click={higher}>Higher</button>
			<button on:click={lower}>Lower</button>
		</div>
	{/if}
</main>

<style>
	main {
		-webkit-background-size: cover !important;
		-moz-background-size: cover !important;
		-o-background-size: cover !important;
		background-size: cover !important;
		flex-grow: 1;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.term-volume__volume {
		font-size: 8.5vh;
	}
	.term-volume__volume {
		font-size: 34px;
		line-height: 1;
	}

	.term-volume__volume {
		font-size: 33px;
		font-weight: 700;
		color: #fff989;
		opacity: 1;
		line-height: 0.75;
		margin-bottom: 10px;
	}

	div.buttonContainer {
		display: inline-block;
	}

	button {
		display: block;
		/* background-color: #333; */
		font-size: 2.2em;
		min-width: 10vw;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
