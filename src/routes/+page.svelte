<script lang="ts">
	import Highscore from '$lib/logic/Highscore';
	let { data } = $props();

	let lastStation: DelayInfo | undefined = $state();
	let newStation: DelayInfo | undefined = $state();

	let justStarted = $state(true);
	let failed = $state(false);
	let score = $state(0);
	let win = $state(false);
	let loss = $state(false);
	let chooseActive = $state(true);

	import GameOver from '$lib/components/GameOver.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import LastCity from '$lib/components/LastCity.svelte';
	import NewCity from '$lib/components/NewCity.svelte';
	import VersusIcon from '$lib/components/VersusIcon.svelte';

	import { getNextStationArrivalDelay } from '$lib/logic/StationSelector.js';
	import type { DelayInfo } from '$lib/typing/types';
	import { Decision } from '$lib/typing/types';

	/**
	 * Uses variables in here to call outside logic function.
	 * Returns next station delay info to use in game and also triggers replenishing of cache for next stations.
	 */
	function getNext() {
		return getNextStationArrivalDelay(
			data.stationMap,
			data.stationDelayInfoPromiseCache,
			data.usedCityCodes,
			data.disqualifiedCityCodes
		);
	}

	const re_start = async () => {
		score = 0;
		failed = false;
		loss = false;
		win = false;

		const firstDelay = await getNext();
		const secondDelay = await getNext();

		if (!firstDelay || !secondDelay) {
			console.warn('Not enough stations with delay configured for start');
			// alert('Nicht genügend Bahnhöfe mit Verspätungen konfiguriert für gerade!');
			return;
		}

		lastStation = firstDelay;
		newStation = secondDelay;

		chooseActive = true;
	};

	const nextGuess = async () => {
		win = false;
		loss = false;

		const newCalc = await getNext();

		if (!newCalc) {
			console.warn('Not enough stations with delay configured for next round');
			// alert('Kein weiterer Bahnhof mit Verspätung konfiguriert für weitere Runde!');
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

	re_start();
</script>

<page>
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
			{#if lastStation && newStation}
				<LastCity bind:station={lastStation} />
				<VersusIcon bind:win {loss} />
				<NewCity bind:station={newStation} bind:chooseActive on:message={onmessage} />
			{/if}
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
</page>

<style>
	page {
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
		page {
			max-width: none;
		}

		span.scoreLine {
			font-size: 1.5em;
		}
	}
</style>
