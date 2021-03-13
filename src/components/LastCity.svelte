<script lang="ts">
	export let city: string;
	export let delay: number;
	export let imgLink: string;
</script>

<main
	style="background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('{imgLink}') no-repeat center center fixed;"
>
	<h1>{city}</h1>
	<div class="term-volume">
		<p class="term-volume__volume">{delay}</p>
		<p>Minuten Verspätung gesamt</p>
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
</style>
