<script lang="ts">
	export let win: boolean;
	export let loss: boolean;
</script>

<page>
	<div class:win class:loss class={`versus-block`}>
		<div class="versus-block__text">vs</div>
		<div class="versus-block__overlay" />
		<div class="versus-block__icon" />
		<div />
	</div>
</page>

<style>
	/* TODO write own design not copy original */

	.versus-block {
		height: 6.25rem;
		width: 6.25rem;
	}

	.versus-block {
		position: absolute;
		height: 6rem;
		width: 6rem;
		border-radius: 50%;
		background: #fff;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		display: table;
		text-transform: uppercase;
		overflow: hidden;
	}

	.versus-block__text {
		font-size: 2.5rem;
	}

	.versus-block__text {
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		color: #000;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.versus-block__overlay {
		position: absolute;
		content: " ";
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.versus-block__icon {
		background-repeat: no-repeat;
		height: 25px;
		left: 50%;
		position: absolute;
		top: 50%;
		opacity: 0;
		-webkit-transition: opacity 0.3s linear;
		-o-transition: opacity 0.3s linear;
		transition: opacity 0.3s linear;
		transition-delay: 0s;
		-webkit-transition-delay: 0.5s;
		-o-transition-delay: 0.5s;
		transition-delay: 0.5s;
		-webkit-transform-origin: center center;
		-ms-transform-origin: center center;
		transform-origin: center center;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		width: 25px;
	}

	/* animation */
	.versus-block.loss .versus-block__icon,
	.versus-block.win .versus-block__icon {
		height: 25px;
		width: 25px;
		opacity: 1;
		-webkit-animation-fill-mode: forwards;
		animation-fill-mode: forwards;
		-webkit-animation: pop-in 0.3s cubic-bezier(0.24, -0.17, 0.45, 1.99)
			0.5s;
		animation: pop-in 0.3s cubic-bezier(0.24, -0.17, 0.45, 1.99) 0.5s;
	}

	.win,.loss {
		-webkit-animation: pop-out 0.2s ease-out 1.2s;
		animation: pop-out 0.2s ease-out 1.2s;
		animation-fill-mode: none;
		-webkit-animation-fill-mode: forwards;
		animation-fill-mode: forwards;
	}

	/* loss */
	.loss .versus-block__overlay {
		background: #c75555;
		height: 100%;
	}

	.loss .versus-block__icon {
		background-image: url('../cross.svg');
	}

	/* win */
	.win .versus-block__overlay {
		background: #59ac51;
		height: 100%;
	}

	.win .versus-block__icon {
		background-image: url('../tick.svg');
	}
</style>
