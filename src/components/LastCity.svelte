<script lang="ts">
	import type { DelayInfo } from "../typing/types";
	export let station: DelayInfo;
</script>

<main
	style="background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('{station.photoUrl}') no-repeat center center fixed;"
>
	<h1>{station.name}</h1>
	<div class="term-volume">
		<p class="term-volume__volume">{station.delay}</p>
		<p>Minute(n) Verspätung gesamt</p>
	</div>

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
		flex-grow: 1 !important;
	}

	main {
		text-align: center;
		padding: 1em;
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

	@media (min-width: 640px) {
		main {
			max-width: none;
			width: 100%;
		}
	}

	/* mobile stacked view */
	@media (max-width: 640px) {
		main {
			height: 50%;
			width: 100%;
		}
	}

	/* attribution  */
	#attributionContainer {
		position: fixed;
		bottom: 10px;
		left: 10px;
		text-align: left;
		/* right: 50vw; */
		/* text-align: right; */
	}

	span.attributionLine {
		display: block;
		font-size: 0.6em;
		color: #bebbbb;
	}
</style>
