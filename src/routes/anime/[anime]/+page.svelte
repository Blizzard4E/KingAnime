<script>
	import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import { THEME } from '$lib/stores'; 
	import { onMount } from 'svelte';
    /**
	 * @type {number}
	 */
    let currentTheme;

    THEME.subscribe(value => {
        currentTheme = value;
    })

    onMount(() => {
        setTimeout(() => {
            allowVideoHover = true;
        }, 2000);
    })

    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);

    /**
	 * @param {number} anime_id
	 */
    async function getYoutubeLink(anime_id) {
        const response = await fetch('https://kitsu.io/api/edge/anime/' + anime_id);
        const kitsu = await response.json();
        return kitsu.data.attributes.youtubeVideoId;
    }

    /**
    * @param {RequestInfo | URL | null} imgPath
    */
    function fixImgURL(imgPath) {
        if(imgPath == null) {
            return new Promise((resolve) => {
                resolve(imgPath);
            })
        }
        else {
            return new Promise((resolve) => {
                fetch(imgPath)
                .then(response => response.blob())
                .then(imageBlob => {
                    resolve(URL.createObjectURL(imageBlob));
                }); 
            })
        }
    }

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
    
    let allowEp = 12;

    /**
	 * @param {{ episodes: string | any[]; }} anime
	 */
    async function allowMoreEp(anime) {
        if(allowEp + 10 >= anime.episodes.length) {
            allowEp = anime.episodes.length;
        }
        else {
            allowEp += 10;
        }
    }

    /**
	 * @param {any} anime
	 */
    async function fixData(anime) {
        const newAnimeTitle = await fixAnimeTitle(anime.title);
        anime.title = newAnimeTitle;
        if(anime.episodes.length > 30) {
            allowEp = 30;
        }
        else {
            for (const episode of anime.episodes) {
                episode.image = await fixImgURL(episode.image);
            }
            allowEp = anime.episodes.length;
        }
        return anime;
    }
    async function fetchAnime() {
        console.log("Fetching Anime");
        const response = await fetch('https://api.enime.moe/anime/' + data.anime);
        const result = await response.json();
        let anime = await fixData(await result);
        anime.youtubeID = await getYoutubeLink(anime.mappings.kitsu);
        return anime;
    }

    /**
	 * @type {HTMLImageElement}
	 */
    let playButton;
    /**
	 * @type {HTMLImageElement}
	 */
    let thumbnail;
    let allowVideoHover = false;

    function playTrailer() {
        if(allowVideoHover) {
            // @ts-ignore
            document.getElementById('crimson-music').pause();
            // @ts-ignore
            document.getElementById('gold-music').pause();
            // @ts-ignore
            playButton.style.opacity = 0;
            // @ts-ignore
            thumbnail.style.opacity = 0;
            playButton.style.pointerEvents = 'none';
            thumbnail.style.pointerEvents = 'none';
        }
    }
</script>

<main>
    <BgVideo/>
    <Nav/>
    {#await fetchAnime()}
    <!-- promise is pending -->
    {:then anime}
    <div class="bg-1">
        <div class="container">
            <div class="grid">
                <div class="col-1" style={"background: radial-gradient(transparent, transparent, rgba(36, 36, 36, 0.1), rgba(36, 36, 36, 0.9)), url('" + anime.coverImage + "');" + "background-position: center;" + "background-size: cover;"}>
                </div>
                <div class="col-2">
                    <img bind:this={playButton} on:mouseenter={() => playTrailer()} on:click={() => playTrailer()} class="play" src="/images/play.png" alt="">
                    <img bind:this={thumbnail} on:mouseenter={() => playTrailer()} on:click={() => playTrailer()} class="thumbnail" src={"https://i.ytimg.com/vi/" + anime.youtubeID + "/maxresdefault.jpg"} alt="">
                    <iframe src={'https://www.youtube.com/embed/' + anime.youtubeID} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-2">
        <div class="container">
            <h1><span>{anime.title[0]}</span>{anime.title}</h1>
            <h4>Genre:
                {#each anime.genre as genre}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                {/each}
            </h4>
            <p>{@html anime.description}</p>
            <ul>
                {#if allowEp > 24}
                    {#each Array(allowEp) as _, i}
                        {anime.episodes[i].number}
                    {/each}
                {:else}
                    {#each Array(allowEp) as _, i}
                        <img src={anime.episodes[i].image} alt="">
                        {anime.episodes[i].number}
                    {/each}
                {/if}
                <button on:click={() => {allowMoreEp(anime)}}>Show more</button>
            </ul>
        </div>
    </div>
    {/await}
</main>

<style lang="scss"> 
    main {
        width: 100vw;
        min-height: 100vh;
    }
    .bg-1 {
        width: 100vw;
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.7),rgba(36, 36, 36, 0.9));
    }
    .bg-2 {
        width: 100vw;
        background: rgba(36, 36, 36, 0.9);
    }
    .container {
        margin: auto 18%;
    }
    h1 {
        font-family: 'Noto Serif Georgian', sans-serif;
        font-size: 2.5rem;
        padding-top: 1rem;
        line-height: 1;
        margin-bottom: 0.5rem;
        color: white;
        font-weight: bold;

        span {
            
        }
        &::first-letter {
            font-size: 0;
        }
    }
    h4 {
        line-height: 1.2;
        font-family: 'Quicksand', sans-serif;
        font-size: 1.1rem;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.9);
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 0.5rem;

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
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .grid {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 2fr 5fr;
        column-gap: 1rem;
        height: 50vh;

        .col-1 {
            img {
                &:nth-child(1) {
                    z-index: 1;
                }
                &:nth-child(2) {
                    z-index: 2;
                }
            }
        }
        .col-2 {  
            position: relative;
            img {
                cursor: pointer;
            }
            .play {
                z-index: 2;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: 0.3s ease-in-out;
                width: 40px;
                height: auto;
                filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4));
            }
            .thumbnail {
                z-index: 1;
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: 0.3s ease-in-out;
                filter: brightness(0.6);
            }
            iframe {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                user-select: none;
            }
        }
    }
</style>
