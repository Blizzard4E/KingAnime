<script>
	import { goto } from "$app/navigation";
	import { THEME } from "$lib/stores";

    /**
	 * @type {number}
	 */
    let currentTheme;
    /**
	 * @type {number}
	 */
    let maxPage;
    /**
	 * @type {number}
	 */
    let page = 1;
    /**
	 * @type {any[]}
	 */
    let searchedAnimes = [];

    THEME.subscribe(value => {
        currentTheme = value;
    })
    /**
	 * @type {any}
	 */
     export let searchedName;

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
            const newAnimeTitle = await fixAnimeTitle(anime.title);
            if(anime.description == null || anime.description == "") {
                anime.description = "This anime does not have a description.";
            }
            anime.title = newAnimeTitle;
        }
        return animes;
    }

    /**
	 * @param {string} name
	 */
    async function fetchAnimes(name) {
        if(name == "") return [];
        console.log("Fetching Searched Animes");
        const response = await fetch('https://api.enime.moe/search/' + name);
        const result = await response.json(); 
        maxPage = result.meta.lastPage;
        const animes = await fixData(await result.data);
        console.log(animes);
        searchedAnimes = animes;
        return animes;
    }

    async function fetchMoreAnimes() {
        page++;
        const response = await fetch('https://api.enime.moe/search/' + searchedName + "?page=" + page);
        const result = await response.json();
        const animes = await fixData(await result.data); 
        searchedAnimes = searchedAnimes.concat(animes);
        console.log(page);
    }
    /**
	 * @param {string | URL} path
	 */
     function transitionStart(path) {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 1;
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>

<main>
    {#await fetchAnimes(searchedName)}
        <!-- promise is pending -->
    {:then value}
        <ul>
            {#each searchedAnimes as anime}
                <li on:click={() => {transitionStart("/anime/" + anime.slug)}}>
                    <div class="item">
                        <div class="cover"><img src={anime.coverImage} alt=""></div>
                        <h1>{anime.title}</h1>
                        <h2>{anime.status}</h2>
                        {#if anime.currentEpisode > 1}
                            <h2>{anime.currentEpisode} Episodes</h2>
                        {:else}
                            <h2>{anime.currentEpisode} Episode</h2>
                        {/if}
                    </div>
                    <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                </li>
            {/each}
        </ul>
        {#if page < maxPage}
            <div class="show-btn"><button on:click={() => {fetchMoreAnimes()}}>Show more...</button></div>
        {/if}
    {/await}
</main>

<style lang="scss">
    main {
        padding-bottom: 2rem;
    }
    .show-btn {
        width: 100%;
        display: grid;
        place-items: center;

        button {
            cursor: pointer;
            background: transparent;
            font-family: 'Quicksand', sans-serif;
            font-size: 1rem;
            font-weight: normal;
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            transition: 0.25s ease-in-out;

            &:hover {
                color: white;
            }
        }
    }
    ul {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        place-items: center;
        row-gap: 1rem;
        padding-top: 2rem;
        padding-bottom: 1rem;

        li {
            $item-width: 180px; 
            position: relative;
            clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
            cursor: pointer;
            -webkit-font-smoothing: subpixel-antialiased;
            transition: 0.25s ease-in-out;

            &:hover {
                img {
                    filter: brightness(0.6);
                    transform: scale(1.2);
                }
            }
            .item {
                margin: 0.15rem;
                position: relative;
                width: $item-width;
                background-color: $dark;
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                z-index: 1;
                padding-bottom: 0.15rem;
            }
            
            .cover {
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                width: 100%;
                height: 206px;
                overflow: hidden;
            }
            img {
                display: block;
                height: 100%;
                width: 100%;
                object-fit: cover;
                transition: 0.25s ease-in-out;
            }
            h1 {
                letter-spacing: 1px;
                margin: 0 1rem;
                font-family: 'Noto Serif Georgian', sans-serif;
                font-weight: normal;
                font-size: 1rem;
                color: white;
                font-weight: 700;
                margin-top: 0.4rem;
                margin-bottom: 0.2rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: center;
                cursor: pointer;
            }
            h2 {
                padding: 0.1rem;
                padding-bottom: 0.2rem;
                font-family: 'Quicksand', sans-serif;
                font-size: 0.9rem;
                color: white;
                font-weight: normal;
                text-align: center;
            }
            .bg {
                background-size: cover;
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: calc(100% + 0.25rem);
                height:calc(100% + 0.25rem);
                z-index: 0;
                transition: 0.3s ease-out;
            }
            .gold {
                background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
            }
            .crimson {
                background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);   
            }
        }
    }
</style>