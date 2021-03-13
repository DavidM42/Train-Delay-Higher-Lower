<script lang="ts">
	export let score: number;
</script>

<main>
	<h1>Dein Ergebnis</h1>
	<h2>{score} Punkte</h2>

	{#if score == 0}
		<span><strong>Schwach!</strong></span>
	{:else if score > 0 && score < 3}
		<span>Naja wenigstens etwas</span>
	{:else}
		<span>Schon mal nicht schlecht</span>
	{/if}

	<div class="inlineContainer">
		<button on:click>Neustart!</button>
	</div>
</main>

<style>
	:global(body) {
		background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
			url("../bahntafel.jpg") no-repeat center center fixed;
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	div.inlineContainer {
		display: inline;
	}

	button {
		display: block;
		font-size: 1.8em;
		min-width: 10vw;
		margin-left: auto;
		margin-right: auto;
		margin-top: 25px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
