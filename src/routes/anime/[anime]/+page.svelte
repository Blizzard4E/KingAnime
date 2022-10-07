<script>
	import { goto } from '$app/navigation';
	import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import { THEME } from '$lib/stores'; 
	import { onMount } from 'svelte';
    /**
	 * @type {number}
	 */
    let currentTheme;
    let allowEp = 12;
    /**
	 * @type {string | any[]}
	 */
    let episodes = [];

    THEME.subscribe(value => {
        currentTheme = value;
    })

    onMount(() => {
        setTimeout(() => {
            allowVideoHover = true;
        }, 2500);
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
	 * @param {{ coverImage: any; }} anime
	 */
    function fixImgURL(imgPath, anime) {
        if(imgPath == null) {
            console.log(anime.coverImage);
            return new Promise((resolve) => {
                resolve(anime.coverImage);
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

    /**
	 * @param {any} anime
	 */
    async function allowMoreEp(anime) {
        if(allowEp == episodes.length) return;
        if(allowEp + 12 >= episodes.length) {
            let count = 1;
            for (const episode of episodes) {
                if(count == episodes.length + 1) break;
                if(count > allowEp) {
                    episode.image = await fixImgURL(episode.image, anime);
                }
                count++;
            }
            allowEp = episodes.length;
        }
        else {
            let count = 1;
            for (const episode of episodes) {
                if(count == allowEp + 13) break;
                if(count > allowEp) {
                    episode.image = await fixImgURL(episode.image, anime);
                }
                count++;
            }
            allowEp += 12;
        }
    }

    /**
	 * @param {any} anime
	 */
    async function fixData(anime) {
        const newAnimeTitle = await fixAnimeTitle(anime.title);
        anime.title = newAnimeTitle;
        anime.episodes.reverse();
        if(anime.episodes.length > 28) {
            allowEp = 28;
        }
        else {
            allowEp = anime.episodes.length;
        }
        let count = 1;
        for (const episode of anime.episodes) {
            episode.image = await fixImgURL(episode.image, anime);
            if(count == allowEp) break;
            else count++;
        }
        return anime;
    }
    async function fetchAnime() {
        console.log("Fetching Anime");
        const response = await fetch('https://api.enime.moe/anime/' + data.anime);
        const result = await response.json();
        let anime = await fixData(await result);
        episodes = anime.episodes;
        anime.youtubeID = await getYoutubeLink(anime.mappings.kitsu);
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
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
                    <iframe src={'https://www.youtube.com/embed/' + anime.youtubeID} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-2">
        <div class="container">
            <div style="display: flex;">
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>{anime.title[0]}</span>
                <h1>{anime.title}</h1>
            </div>
            <h4>Genre:
                {#each anime.genre as genre}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                {/each}
            </h4>
            <p>{@html anime.description}</p>
            <h4>Episodes:</h4>
            <ul>
                {#each Array(allowEp) as _, i}
                    <li on:click={() => transitionStart("/anime/" + anime.slug + "/" + episodes[i].number)}>
                        <div class="content">
                            <div style="position: relative;width: 100%; overflow: hidden;">
                                <img src="/images/play.png" alt="">
                                <img src={episodes[i].image} alt="">
                            </div>
                            <h5>Episode {episodes[i].number}</h5>
                        </div>
                        <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                    </li>
                {/each}
            </ul>
            {#if allowEp < episodes.length}
                <div class="show-btn"><button on:click={() => {allowMoreEp(anime)}}>Show more...</button></div>
            {/if}
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
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.5),rgba(36, 36, 36, 0.7), rgba(36, 36, 36, 0.9), rgba(36, 36, 36, 0.95),rgba(36, 36, 36, 0.99));
    }
    .bg-2 {
        width: 100vw;
        background: rgba(36, 36, 36, 0.99);
        padding-bottom: 4rem;
    }
    .container {
        margin: auto 18%;
    }
    h1 {
        font-family: 'Noto Serif Georgian', sans-serif;
        font-size: 2.5rem;
        padding-top: 1rem;
        line-height: 1;
        color: white;
        font-weight: bold;
        &::first-letter {
            font-size: 0;
        }
    }
    span {
        font-size: 2.5rem;
        padding-top: 1rem;
        line-height: 1;
        color: white;
        font-weight: bold;
        font-family: 'Seagram', sans-serif;
        margin-right: 0.1rem; 
    }
    span.gold {
        background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    span.crimson {
        background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 1rem;
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
        }
        iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            user-select: none;
        }
    }
    ul {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 1.5rem;
        row-gap: 1.5rem;
        padding-bottom: 1rem;

        li {
            position: relative;
            width: 100%;
            display: grid;
            place-items: center;
            animation: FadeIn;
            animation-duration: 1s;
            animation-timing-function: ease-in-out;

            &:hover {
                cursor: pointer;
                .content {
                    img {
                        &:nth-child(1) {
                            opacity: 1;
                        }
                        &:nth-child(2) {
                            transform: scale(1);
                            filter: brightness(0.6);
                        }
                    }
                }
            }
            .content {
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                z-index: 1;
                display: grid;
                place-items: center;
                background-color: rgba(36, 36, 36, 1);
                width: 100%; 

                img {
                    display: block;
                    transition: 0.25s ease-in-out;

                    &:nth-child(1) {
                        position: absolute;
                        width: 30px;
                        z-index: 1;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        opacity: 0;
                    }
                    
                    &:nth-child(2) {
                        width: 100%;
                        object-fit: cover;
                        object-position: center;
                        transform: scale(1.2);
                        max-height: 160px;
                    }
                }
            }
            h5 {
                padding: 0.5rem;
                width: 80%;
                font-family: 'Quicksand', sans-serif;
                font-size: 1rem;
                font-weight: normal;
                text-align: center;
                color: white;
                transition: 0.3s ease-in-out;

                &:nth-child(3) {
                    margin-bottom: 0.5rem;
                }
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
            .bg.gold {
                background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
            }
            .bg.crimson {
                background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);
            }
        }
    }
    @keyframes FadeIn {
        from { opacity: 0;}
        to  {opacity: 1;}
    }
</style>
