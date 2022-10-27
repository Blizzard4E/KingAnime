<script>
	import { goto } from "$app/navigation";
	import { THEME } from "$lib/stores";
	import MediaQuery from "./MediaQuery.svelte";

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
    let recentAnimeEpisodes = [];

    THEME.subscribe(value => {
        currentTheme = value;
    })

    /**
	 * @param {{ english: null; userPreferred: any; }} title
	 */
     function fixAnimeTitle(title) {
        console.log(title.hasOwnProperty('english'))
        if(title.hasOwnProperty('english')) {
            if(title.english != null) {
                return new Promise((resolve) => {
                    resolve(title.english);
                })
            }
            else {
                return new Promise((resolve) => {
                    resolve(title.userPreferred);
                })
            }
        }
        else {
            return new Promise((resolve) => {
                resolve(title.userPreferred);
            })
        }
    }

     /**
	 * @param {any} animeEpisodes
	 */
     async function fixData(animeEpisodes) {
        for (const animeEpisode of animeEpisodes) {
            const newAnimeTitle = await fixAnimeTitle(animeEpisode.anime.title);
            if(animeEpisode.anime.description == null || animeEpisode.anime.description == "") {
                animeEpisode.anime.description = "This anime does not have a description.";
            }
            animeEpisode.anime.title = newAnimeTitle;
        }
        return animeEpisodes;
    }

    async function fetchAnimesEpiodes() {
        console.log("Fetching Searched Animes");
        const response = await fetch('https://api.enime.moe/recent',{
            method: "GET",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        });
        const result = await response.json(); 
        maxPage = result.meta.lastPage;
        const animeEpisodes = await fixData(await result.data);
        console.log(animeEpisodes);
        recentAnimeEpisodes = animeEpisodes;
        return animeEpisodes;
    }

    async function fetchMoreAnimesEpiodes() {
        page++;
        const response = await fetch("https://api.enime.moe/recent?page=" + page,{
            method: "GET",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        });
        const result = await response.json();
        const animes = await fixData(await result.data); 
        recentAnimeEpisodes = recentAnimeEpisodes.concat(animes);
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
    {#await fetchAnimesEpiodes()}
        <!-- promise is pending -->
    {:then value}
        <MediaQuery query="(min-width: 1281px)" let:matches>
            {#if matches}
            <ul>
                {#each recentAnimeEpisodes as animeEpisode}
                    <li on:click={() => {transitionStart("/anime/" + animeEpisode.anime.slug + "/" + animeEpisode.number)}}>
                        <div class="item">
                            <div class="cover"><img src={animeEpisode.anime.coverImage} alt=""></div>
                            <h1>{animeEpisode.anime.title}</h1>
                            <h2>Episode {animeEpisode.number}</h2>
                        </div>
                        <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                    </li>
                {/each}
            </ul>
            {#if page < maxPage}
                <div class="show-btn"><button on:click={() => {fetchMoreAnimesEpiodes()}}>Show more...</button></div>
            {/if}
            {/if}
        </MediaQuery>
        
        <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
            {#if matches}
            <ul class="tablet">
                {#each recentAnimeEpisodes as animeEpisode}
                    <li on:click={() => {transitionStart("/anime/" + animeEpisode.anime.slug + "/" + animeEpisode.number)}}>
                        <div class="item">
                            <div class="cover"><img src={animeEpisode.anime.coverImage} alt=""></div>
                            <h1>{animeEpisode.anime.title}</h1>
                            <h2>Episode {animeEpisode.number}</h2>
                        </div>
                        <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                    </li>
                {/each}
            </ul>
            {#if page < maxPage}
                <div class="show-btn"><button on:click={() => {fetchMoreAnimesEpiodes()}}>Show more...</button></div>
            {/if}
            {/if}
        </MediaQuery>
        
        <MediaQuery query="(max-width: 480px)" let:matches>
            {#if matches}
            <div class="root mobile">
                mobile
            </div>
            {/if}
        </MediaQuery> 
    {/await}
</main>

<style lang="scss">
    main {
        padding-bottom: 2rem;
    }
    @keyframes popIn {
        from { 
            opacity: 0;
            transform: scale(0);
        }
        to { 
            opacity: 1;
            transform: scale(1);
        }
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
        $item-width: 180px; 
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax($item-width, 1fr));
        place-items: center;
        column-gap: 1rem;
        row-gap: 1rem;
        padding-bottom: 1rem;

        li {
            position: relative;
            clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
            cursor: pointer;
            -webkit-font-smoothing: subpixel-antialiased;
            transition: 0.25s ease-in-out;
            animation: popIn;
            animation-duration: 0.8s;
            animation-timing-function: ease-in-out;
            animation-fill-mode: forwards;

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
                font-family: 'Quicksand', sans-serif;
                font-weight: normal;
                font-size: 0.95rem;
                color: white;
                font-weight: 500;
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
                text-align: center;
                font-weight: 400;
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
    .tablet {
        $item-width: 100px;
    }
</style>