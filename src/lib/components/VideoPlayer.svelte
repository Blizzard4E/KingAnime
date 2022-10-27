<script>
	import { goto } from "$app/navigation";
	import { THEME } from "$lib/stores";
	import MediaQuery from "./MediaQuery.svelte";
    /**
	 * @type {number}
	 */
    let currentTheme;   
    let currentSource = 0;
    /**
	 * @type { any }
	 */
    export let currentEpObj;
    /**
	 * @type { any }
	 */
    export let anime;

    THEME.subscribe(value => {
        currentTheme = value;
    })
    
    /**
	 * @param {string} id
	 */
     async function fetchVideoPlayer(id) {
        return new Promise((resolve) => {
            console.log(id)
            fetch('https://api.enime.moe/source/' + id)
            .then(res => res.json())
            .then(result => {
                let videoURL;
                try{
                    // @ts-ignore
                    videoURL = result.referer;
                }
                catch{
                    videoURL = null;
                }
                resolve(videoURL);
            })
        })
    }
    /**
	 * @param {any} sources
	 */
    async function fetchVideos(sources) {
        let videoPlayers = [];
        let count = 0;
        for (const source of sources) {
            videoPlayers[count] = await fetchVideoPlayer(source.id);
            count++;
        }
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
        // @ts-ignore
        document.getElementById('crimson-music').pause();
        // @ts-ignore
        document.getElementById('gold-music').pause();
        return videoPlayers;
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

<section class="video-section">
    {#await fetchVideos(currentEpObj.sources)}
        <!-- promise is pending -->
    {:then videoPlayers}
        <MediaQuery query="(min-width: 1281px)" let:matches>
            {#if matches}
            <div>
                <div class="container">
                    {#if currentEpObj.title == null}
                        <h1>Ep <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>{currentEpObj.number}</span></h1>
                    {:else}
                    <h1>Ep <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>{currentEpObj.number}</span> : "{currentEpObj.title}"</h1>
                    {/if}
                </div>
                <div class="container video-player">
                    {#each videoPlayers as video, i}
                        {#if currentSource == i}
                            <iframe scrolling="no" title="video-player" src={video} frameborder="0" allowfullscreen></iframe>
                        {/if}
                    {/each}
                    <div class="controls">
                        <ul>
                            {#each currentEpObj.sources as source, i}
                                <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                    <button on:click={() => currentSource = i}>Source {i + 1}</button>
                                    <div class="bg"></div>
                                </li>
                            {/each}
                        </ul>
                        <ul>
                            {#if parseInt(currentEpObj.number) - 1 > 0}
                            <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                <button on:click={() => {transitionStart('/anime/' + anime.slug + "/" + (parseInt(currentEpObj.number) - 1))}}>Prev</button>
                                <div class="bg"></div>
                            </li>
                            {/if}
                            {#if parseInt(currentEpObj.number) + 1 <= anime.episodes.length}
                            <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                <button on:click={() => {transitionStart('/anime/' + anime.slug + "/" + (parseInt(currentEpObj.number) + 1))}}>Next</button>
                                <div class="bg"></div>
                            </li>
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
            {/if}
        </MediaQuery>
        
        <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
            {#if matches}
            <div class="tablet">
                <div class="container">
                    {#if currentEpObj.title == null}
                        <h1>Ep <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>{currentEpObj.number}</span></h1>
                    {:else}
                    <h1>Ep <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>{currentEpObj.number}</span> : "{currentEpObj.title}"</h1>
                    {/if}
                </div>
                <div class="container">
                    <div class="video-player">
                        {#each videoPlayers as video, i}
                            {#if currentSource == i}
                                <iframe scrolling="no" title="video-player" src={video} frameborder="0" allowfullscreen></iframe>
                            {/if}
                        {/each}
                        <div class="controls">
                            <ul>
                                {#each currentEpObj.sources as source, i}
                                    <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                        <button on:click={() => currentSource = i}>Source {i + 1}</button>
                                        <div class="bg"></div>
                                    </li>
                                {/each}
                            </ul>
                            <ul>
                                {#if parseInt(currentEpObj.number) - 1 > 0}
                                <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                    <button on:click={() => {transitionStart('/anime/' + anime.slug + "/" + (parseInt(currentEpObj.number) - 1))}}>Prev</button>
                                    <div class="bg"></div>
                                </li>
                                {/if}
                                {#if parseInt(currentEpObj.number) + 1 <= anime.episodes.length}
                                <li class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>
                                    <button on:click={() => {transitionStart('/anime/' + anime.slug + "/" + (parseInt(currentEpObj.number) + 1))}}>Next</button>
                                    <div class="bg"></div>
                                </li>
                                {/if}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
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
</section>

<style lang="scss">
    section{
        width: 100vw;
    }
    .container {
        margin: auto 18%;
    }
    iframe {
        width: 100%;
        aspect-ratio: 16/9;
    } 
    h1 {
        font-family: 'Noto Serif Georgian', sans-serif;
        font-size: 2rem;
        padding-top: 1rem;
        line-height: 1;
        color: white;
        font-weight: bold;

        span {
            font-size: 2.3rem;
            padding-top: 1rem;
            line-height: 1;
            color: white;
            font-weight: bold;
            font-family: 'Seagram', sans-serif;
        }
        span.gold {
            background: linear-gradient($goldDark, $goldBright, $goldDark);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        span.crimson {
            background: linear-gradient($crimsonDark, $crimsonBright, $crimsonDark);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .video-player {
        padding: 2rem 0;
        display: grid;
        grid-template-columns: 80% 20%;

        .controls {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 1rem;
            margin-top: 1rem;

            li {
                position: relative;
                transition: 0.25s;
            }
            li.gold {
                .bg {
                    background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
                }
                &:hover {
                    filter: drop-shadow(0 0 4px $goldDark);
                }
            }
            li.crimson {
                .bg {
                    background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);
                }
                &:hover {
                    filter: drop-shadow(0 0 4px $crimsonDark);
                }
            }
            button {
                cursor: pointer;
                position: relative;
                clip-path: polygon(0.5rem 0%, 100% 0, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0 100%, 0% 0.5rem);
                padding: 0.6rem 1rem;
                background-color: rgba(36, 36, 36, 1);
                color: white;
                z-index: 1;
                font-family: 'Quicksand', sans-serif;
                font-size: 0.9rem;
                font-weight: normal;
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                column-gap: 1rem;
                row-gap: 1rem;
            }

            .bg {
                background-size: cover;
                clip-path: polygon(0.5rem 0%, 100% 0, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0 100%, 0% 0.5rem);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: calc(100% + 0.15rem);
                height:calc(100% + 0.15rem);
                z-index: 0;
                transition: 0.3s ease-out;
            }
        }
    }
    .tablet {
        .video-player {
            margin-left: 1.5rem;
            margin-right: 1.5rem;
        }
        .container {
            margin: auto;
            width: 100%;
        }
        h1 {
            margin-left: 1.5rem;
            margin-right: 1.5rem;
        }
    }
</style>