/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        anime: params.anime
    };
}