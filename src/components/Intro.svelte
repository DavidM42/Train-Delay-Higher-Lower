<script lang="ts">
	export let justStarted: boolean;

	function start(node) {
		justStarted = false;
	}
</script>

<page>
	<h1>Zugverspätung higher lower</h1>
	<h2>Welcher Bahnhof sammelt zurzeit mehr Ankunfts-Verspätungs-Minuten?</h2>
	<span>Eine spassige Method die Echtzeit Fahrplandaten der Bahn zu nutzen</span>
	<div class="inlineContainer">
		<button on:click={start}>Go</button>
	</div>
</page>

<style>
	:global(body) {
		background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
			url("../bahntafel.jpg") no-repeat center center fixed;
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
	}

	page {
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
		font-size: 2.2em;
		min-width: 10vw;
		margin-left: auto;
		margin-right: auto;
		margin-top: 25px; 
	}

	@media (max-width: 640px) {

		page {
			overflow-y: scroll;
		}

		h1 {
			font-size: 2.1em;
		}

		h2 {
			font-size: 1.1em;
		}

		button {
			font-size: 1.7em;
		}
	}

	@media (min-width: 640px) {
		page {
			max-width: none;
		}
	}
</style>
