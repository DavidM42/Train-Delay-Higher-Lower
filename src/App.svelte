<script lang="ts">
	import StationSelector from "./StationSelector";

	export let lastCity: string;
	export let lastDelay: number;
	export let lastImageLink: string;

	export let newCity: string;
	export let newDelay: number;
	export let newImageLink: string;

	let justStarted = true;
	let failed = false;
	let score = 0;
	let win = false;
	let loss = false;
	let chooseActive = true;
	const selector = new StationSelector();

	import Intro from "./components/Intro.svelte";
	import GameOver from "./components/GameOver.svelte";
	import LastCity from "./components/LastCity.svelte";
	import NewCity from "./components/NewCity.svelte";
	import VersusIcon from "./components/VersusIcon.svelte";

	import { Decision } from "./typing/types";

	const re_start = async () => {
		score = 0;
		failed = false;
		loss = false;
		win = false;

		const firstDelay = await selector.getNextStationArrivalDelay();
		const secondDelay = await selector.getNextStationArrivalDelay();

		if (!firstDelay || !secondDelay) {
			alert(
				"Nicht genügend Bahnhöfe mit Verspätungen konfiguriert für gerade!"
			);
			return;
		}

		lastCity = firstDelay.name;
		lastDelay = firstDelay.delay;
		lastImageLink = firstDelay.image;

		newCity = secondDelay.name;
		newDelay = secondDelay.delay;
		newImageLink = secondDelay.image;

		chooseActive = true;
	};

	const nextGuess = async () => {
		win = false;
		loss = false;

		lastCity = newCity;
		lastDelay = newDelay;
		lastImageLink = newImageLink;

		const newCalc = await selector.getNextStationArrivalDelay();

		if (!newCalc) {
			alert(
				"Kein weiterer Bahnhof mit Verspätung konfiguriert für weitere Runde!"
			);
			return;
		}

		newCity = newCalc.name;
		newDelay = newCalc.delay;
		newImageLink = newCalc.image;

		chooseActive = true;
	};

	const onmessage = (event) => {
		chooseActive = false;
		if (event.detail.decision === Decision.HIGHER) {
			const comparision = newDelay >= lastDelay;
			win = comparision;
			loss = !comparision;
		} else if (event.detail.decision === Decision.LOWER) {
			const comparision = newDelay <= lastDelay;
			win = comparision;
			loss = !comparision;
		}

		if (win) {
			score += 1;
			// nextGuess after 1,5s
			setTimeout(() => nextGuess(), 1250);
		} else {
			// send to failed screen after 1,5s
			setTimeout(() => (failed = true), 2000);
		}
	};

	// initial start
	re_start();
</script>

<main>
	<!-- TODO highscore unten links und bild links für cc by rechts und links -->

	{#if justStarted}
		<div class="infoContainer">
			<Intro bind:justStarted />
		</div>
	{:else if failed}
		<div class="infoContainer">
			<GameOver {score} on:click={re_start} />
		</div>
	{:else}
		<div class="progressionContainer">
			<LastCity
				bind:city={lastCity}
				bind:delay={lastDelay}
				bind:imgLink={lastImageLink}
			/>
			<VersusIcon bind:win {loss} />
			<NewCity
				bind:city={newCity}
				bind:delay={newDelay}
				bind:imgLink={newImageLink}
				bind:chooseActive
				on:message={onmessage}
			/>
		</div>

		<div id="scoreContainer">
			<span class="scoreLine">{score}</span>
			<span class="socreLine">Punkte</span>
		</div>
	{/if}
</main>

<style>
	main {
		text-align: center;
	}

	div.infoContainer {
		display: flex;
		height: 100vh;
		/* horizonatally centered */
		align-items: center;
	}

	div.progressionContainer {
		display: flex;
		height: 100vh;

		/* flex-grow: 1; */
		/* flex-basis: fill; */
	}

	/* under one another on mobile */
	@media (max-width: 640px) {
		div.progressionContainer {
			flex-direction: column;
		}
	}

	#scoreContainer {
		position: fixed;
		bottom: 10px;
		right: 20px;

		text-align: right;
		font-size: 1.5em;
	}

	span.scoreLine {
		display: block;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
