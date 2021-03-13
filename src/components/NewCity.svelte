<script lang="ts">
	import { expoIn, expoOut } from "svelte/easing";
	import fadeScale from "../aesthetic/fade-scale";

	import { Decision } from "../typing/types";
	import type { DelayInfo } from "../typing/types";

	export let station: DelayInfo;
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
url('{station.photoUrl}') no-repeat center center fixed;"
>
	<h1>{station.name}</h1>

	{#if !chooseActive}
		<div
			class="term-volume"
			transition:fadeScale={{
				delay: 75,
				duration: 500,
				easing: expoIn,
				baseScale: 0.5,
			}}
		>
			<p class="term-volume__volume">{station.delay}</p>
			<p>Minute(n) Verspätung gesamt</p>
		</div>
	{:else}
		<div class="buttonContainer">
			<!-- 			transition:fadeScale={{
				delay: 75,
				duration: 500,
				easing: expoOut,
				baseScale: 0.5,
			}} -->
			<button on:click={higher}>Higher</button>
			<button on:click={lower}>Lower</button>
		</div>
	{/if}

	<div id="attributionContainer">
		<span class="attributionLine">{station.photographer}</span>
		<span class="attributionLine">{station.license}</span>
	</div>
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
		margin: 0 auto;
	}

	.term-volume__volume {
		font-size: 2em;
		line-height: 1;
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
		min-width: 10vw;
	}

	/* mobile stacked view */
	@media (max-width: 640px) {
		main {
			height: 50%;
			width: 100%;
			max-height: 50%;
		}

		button {
			font-size: 1.2em;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
			width: 100%;
		}

		button {
			font-size: 2.2em;
		}
	}

	/* attribution  */
	#attributionContainer {
		position: fixed;
		right: 10px;
		bottom: 10px;
		text-align: right;
	}

	span.attributionLine {
		display: block;
		font-size: 0.6em;
		color: #bebbbb;
	}
</style>
