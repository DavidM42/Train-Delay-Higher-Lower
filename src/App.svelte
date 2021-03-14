<script lang="ts">
	import StationSelector from "./logic/StationSelector";
	import Highscore from "./logic/Highscore";

	export let lastStation: DelayInfo;

	export let newStation: DelayInfo;

	let justStarted = true;
	let failed = false;
	let score = 0;
	let win = false;
	let loss = false;
	let chooseActive = true;
	let selector: StationSelector = null;

	import Intro from "./components/Intro.svelte";
	import GameOver from "./components/GameOver.svelte";
	import LastCity from "./components/LastCity.svelte";
	import NewCity from "./components/NewCity.svelte";
	import VersusIcon from "./components/VersusIcon.svelte";

	import { Decision } from "./typing/types";
	import type { DelayInfo } from "./typing/types";
	import type { StationMapping } from "./typing/stations";

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

		lastStation = firstDelay;
		newStation = secondDelay;

		chooseActive = true;
	};

	const nextGuess = async () => {
		win = false;
		loss = false;

		const newCalc = await selector.getNextStationArrivalDelay();

		if (!newCalc) {
			alert(
				"Kein weiterer Bahnhof mit Verspätung konfiguriert für weitere Runde!"
			);
			return;
		}
		lastStation = newStation;

		newStation = newCalc;

		chooseActive = true;
	};

	const onmessage = (event) => {
		chooseActive = false;
		if (event.detail.decision === Decision.HIGHER) {
			const comparision = newStation.delay >= lastStation.delay;
			win = comparision;
			loss = !comparision;
		} else if (event.detail.decision === Decision.LOWER) {
			const comparision = newStation.delay <= lastStation.delay;
			win = comparision;
			loss = !comparision;
		}

		if (win) {
			score += 1;

			// if new highscore update it
			if (score > Highscore.highscore) {
				Highscore.highscore = score;
			}

			// nextGuess after 1,5s
			setTimeout(() => nextGuess(), 1250);
		} else {
			// send to failed screen after 1,5s
			setTimeout(() => (failed = true), 2000);
		}
	};

	const initialize = async () => {
		try {
			const station: StationMapping = await (
				await fetch("./stations.json")).json();
			selector = new StationSelector(station);
		} catch (e) {
			console.error(e);
			alert("Initialization station load failed");
		}
		re_start();
	};

	initialize();
</script>

<main>
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
			<LastCity bind:station={lastStation} />
			<VersusIcon bind:win {loss} />
			<NewCity
				bind:station={newStation}
				bind:chooseActive
				on:message={onmessage}
			/>
		</div>

		<div id="highScoreContainer">
			<span class="scoreLine">{Highscore.highscore}</span>
			<span class="scoreLine">Highscore</span>
		</div>

		<div id="scoreContainer">
			<span class="scoreLine">{score}</span>
			<span class="scoreLine">Punkte</span>
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

	#highScoreContainer {
		position: fixed;
		left: 20px;
		text-align: left;
	}

	#scoreContainer {
		position: fixed;
		right: 20px;
		text-align: right;
	}

	/* scores on desktops on bottom left and right */
	@media (min-width: 640px) {
		#highScoreContainer {
			bottom: 45px;
		}

		#scoreContainer {
			bottom: 45px;
		}
	}

	/* on mobile on top left and right  */
	@media (max-width: 640px) {
		#highScoreContainer {
			top: 10px;
		}

		#scoreContainer {
			top: 10px;
		}
	}

	span.scoreLine {
		display: block;
		font-size: 1.2em;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}

		span.scoreLine {
			font-size: 1.5em;
		}
	}
</style>
