<script>
	import { goto } from '$app/navigation';
	import BgVideo from '$lib/components/BgVideo.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import { THEME } from '$lib/stores';

    /**
	 * @type {number}
	 */
    let currentTheme;   
    let currentSource = 0;

    THEME.subscribe(value => {
        currentTheme = value;
    })

    /** @type {import('./$types').PageData} */
    export let data;

    /**
	 * @param {{ english: null; userPreferred: any; }} title
	 */
    function fixAnimeTitle(title) {
        console.log(title);
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
	 * @param { any } anime
	 */
    async function fixData(anime) {
        const newAnimeTitle = await fixAnimeTitle(anime.title);
        anime.title = newAnimeTitle;
        return anime;
    }
    let episodeObj = {};
    async function fetchAnime() {
        console.log("Fetching Anime");
        const response = await fetch('https://api.enime.moe/anime/' + data.anime,{
            method: "GET",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        });
        const result = await response.json();
        let anime = await fixData(await result);
        if(anime.description == null  || anime.description == "") {
            anime.description = "This anime does not have a description.";
        }
        anime.episodes.forEach((/** @type {{ number?: any; }} */ episode) => {
            if(episode.number == data.episode) episodeObj = episode; 
        });
        return anime;
    }
    /**
	 * @param {string | URL} path
	 */ 
    function transitionStart(path) {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 1;
        setTimeout(() => {
            goto(path);
        }, 1500);
    }
</script>

<main>
    {#await fetchAnime()}
        <!-- promise is pending -->
    {:then anime}
        <VideoPlayer anime={anime} currentEpObj={episodeObj}/>
        <MediaQuery query="(min-width: 1281px)" let:matches>
            {#if matches}
            <section class="info-section">
                <div class="container">
                    <div class="grid">
                        <div class="cover" style={"background: radial-gradient(transparent, transparent, rgba(36, 36, 36, 0.3), rgba(36, 36, 36, 0.9)), url('" + anime.coverImage + "');" + "background-position: center;" + "background-size: cover; height: 260px;"}>
                        </div>
                        <div>
                            <div style="display: flex;">
                                <h2 on:click={() => transitionStart("/anime/" + anime.slug)}>{anime.title}</h2>
                            </div>
                            <h4>Genre:
                                {#each anime.genre as genre}
                                    <!-- svelte-ignore a11y-missing-attribute -->
                                    <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                                {/each}
                            </h4>
                            <p>{@html anime.description}</p>
                        </div>
                    </div>
                </div>
            </section>
            {/if}
        </MediaQuery>
        
        <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
            {#if matches}
            <section class="info-section tablet">
                <div class="container">
                    <div class="grid">
                        <div class="cover" style={"background: radial-gradient(transparent, transparent, rgba(36, 36, 36, 0.3), rgba(36, 36, 36, 0.9)), url('" + anime.coverImage + "');" + "background-position: center;" + "background-size: cover; height: 260px;"}>
                        </div>
                        <div>
                            <div style="display: flex;">
                                <h2 on:click={() => transitionStart("/anime/" + anime.slug)}>{anime.title}</h2>
                            </div>
                            <h4>Genre:
                                {#each anime.genre as genre}
                                    <!-- svelte-ignore a11y-missing-attribute -->
                                    <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                                {/each}
                            </h4>
                            <p>{@html anime.description}</p>
                        </div>
                    </div>
                </div>
            </section>
            {/if}
        </MediaQuery>
        
        <MediaQuery query="(max-width: 480px)" let:matches>
            {#if matches}
            <section class="info-section mobile">
                <div class="container">
                    <div class="grid">
                        <div class="cover" style={"background: radial-gradient(transparent, transparent, rgba(36, 36, 36, 0.3), rgba(36, 36, 36, 0.9)), url('" + anime.coverImage + "');" + "background-position: center;" + "background-size: cover; height: 180px;"}>
                        </div>
                        <div>
                            <div style="display: flex;">
                                <h2 on:click={() => transitionStart("/anime/" + anime.slug)}>{anime.title}</h2>
                            </div>
                            <h4>Genre:
                                {#each anime.genre as genre}
                                    <!-- svelte-ignore a11y-missing-attribute -->
                                    <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                                {/each}
                            </h4>
                            <p>{@html anime.description}</p>
                        </div>
                    </div>
                </div>
            </section>
            {/if}
        </MediaQuery>
    {/await}
</main>

<style lang="scss">
    main {
        width: 100vw;
        min-height: 100vh;
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.8),rgba(36, 36, 36, 0.95), rgba(36, 36, 36, 0.95), rgba(36, 36, 36, 0.95),rgba(36, 36, 36, 0.95));
    }
    section{
        width: 100vw;
    }
    .container {
        margin: auto 18%;
    }
    iframe {
        width: 100%;
        aspect-ratio: 16/9.5;
    } 
    .grid {
        display: flex;
        column-gap: 1rem;

        .cover {
            width: 180px;
            aspect-ratio: 9 / 13;
        }

        h2 {
            font-family: 'Noto Serif Georgian', sans-serif;
            font-size: 2rem;
            line-height: 1;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        h4 {
            line-height: 1.1;
            font-family: 'Quicksand', sans-serif;
            font-size: 1.05rem;
            font-weight: normal;
            color: rgba(255, 255, 255, 0.9);
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin: 0.5rem 0;

            a {
                transition: 0.15s ease-out;
                cursor: pointer;
                &::after {
                    content: ",";
                }
                &:last-child {
                    &::after {
                        content: "";
                    }
                } 
            }
            .gold-genre {
                &:hover {
                    color: $goldDark;
                }
            }
            .crimson-genre {
                &:hover {
                    color: $crimsonDark;
                    text-shadow: 0 0 1px $crimsonBright;
                }
            }
        }
        p {
            line-height: 1.2;
            margin-top: 0.3rem;
            font-family: 'Quicksand', sans-serif;
            font-size: 1.05rem;;
            color: rgba(255, 255, 255, 0.7);
            display: -webkit-box;
            -webkit-line-clamp: 10;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 1rem;
        }
    }
    .tablet {
        .container {
            margin: auto;
            width: 100%;
        }
        .grid {
            margin-left: 1.5rem;
            margin-right: 1.5rem;
        }
    }
    .mobile {
        .container {            
            margin: auto;
            width: 100%;
        }
        .grid {
            margin-left: 1rem;
            margin-right: 1rem;         

            .cover {
                width: 120px;
            }
        }
        h2 {
            font-size: 1.5rem;
        }
        h4, p {
            font-size: 1rem;
        }
    }
</style>
