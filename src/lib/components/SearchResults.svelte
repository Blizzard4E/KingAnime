<script>
    /**
	 * @type {any}
	 */
     export let searchedName;
    /**
	 * @type {number}
	 */
    export let page;

    /**
	 * @param {{ english: null; userPreferred: any; }} title
	 */
     function fixAnimeTitle(title) {
        if(title.english == null) {
            return new Promise((resolve) => {
                resolve(title.userPreferred);
            })
        }
        else {
            return new Promise((resolve) => {
                resolve(title.english);
            })
        }
    }

     /**
	 * @param {any} animes
	 */
     async function fixData(animes) {
        for (const anime of animes) {
            const newAnimeTitle = await fixAnimeTitle(anime.anime.title);
            if(anime.description == null || anime.description == "") {
                anime.anime.description = "This anime does not have a description.";
            }
            anime.anime.title = newAnimeTitle;
        }
        return animes;
    }

    /**
	 * @param {string} name
	 */
    async function fetchAnimes(name) {
        console.log("Fetching Searched Animes");
        const response = await fetch('api.enime.moe/search/' + name);
        const result = await response.json(); 
        const animes = await fixData(await result.data);
        return animes;
    }
</script>

<main>
    <h1>{searchedName}</h1>
    <h2>{page}</h2>
    {#await fetchAnimes(searchedName)}
        <!-- promise is pending -->
    {:then animes}
        <ul>
            {#each animes as anime}
                <li>
                    <img src={anime.coverImage} alt="">
                    <h1>{anime.title}</h1>
                    <h2>{anime.currentEpisode}</h2>
                    <h2>{anime.status}</h2>
                    <div class="bg"></div>
                </li>
            {/each}
        </ul>
    {/await}
</main>