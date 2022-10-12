/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        search: params.search
    };
}