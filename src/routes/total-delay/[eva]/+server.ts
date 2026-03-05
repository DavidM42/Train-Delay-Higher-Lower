import { getTotalArrivalDelay } from '$lib/logic/vendo-api';
import { error, json } from '@sveltejs/kit';

/**
 * Need a server side function to get delay data from api, because apis do not implement CORS
 */
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }: { params: Record<string, string>; url: URL }) {
	const eva = Number(params.eva);

	if (!eva) {
		error(400, 'needs an eva query param');
	}

	const data = await getTotalArrivalDelay(eva);
	return json(data);
}
