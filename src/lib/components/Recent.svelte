<script>
// @ts-nocheck


	import { goto } from '$app/navigation';
	import { THEME } from '$lib/stores'; 
    /**
	 * @type {number}
	 */
    let currentTheme;
    /**
	 * @type {number}
	 */
    export let page;

    THEME.subscribe(value => {
        currentTheme = value;
    })

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
    
    /**
	 * @param {any} animes
	 */
    async function fixData(animes) {
        for (const anime of animes) {
            const newImgURL = await fixImgURL(anime.image);
            const newAnimeTitle = await fixAnimeTitle(anime.anime.title);
            if(anime.anime.description == null || anime.anime.description == "") {
                anime.anime.description = "This anime does not have a description.";
            }
            anime.image = newImgURL;
            anime.anime.title = newAnimeTitle;
        }
        return animes;
    }
    /**
	 * @param {string | number} pageNum
	 */
    async function fetchRecent(pageNum) {
        console.log("Fetching Recent Animes");
        const response = await fetch('https://api.enime.moe/recent?page=' + pageNum + '&perPage=15');
        const result = await response.json(); 
        const animes = await fixData(await result.data);
        let splitCount = 0;
        let count = 0;
        let recents = [[], [], []];

        for (let i = 0; i < animes.length; i++) {
            // @ts-ignore
            recents[splitCount][count] = animes[i];
            count++;
            if(count == 5) {
                count = 0;
                splitCount++;
            }
        }
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
        return recents;
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

{#await fetchRecent(page)}
    <!-- promise is pending -->
{:then recentAnimes}
    {#each recentAnimes as animes} 
    <ul>
        {#each animes as anime}
            <li>
                <div class="item" class:back-light={currentTheme == 1}>
                    <div class="row-1">
                        <div on:click={() => transitionStart("/anime/"+ anime.anime.slug)} class="col-1">
                            <img src="{anime.anime.coverImage}" alt="">
                        </div>
                        <div class="col-2">
                            <div class="info">
                                <h2 on:click={() => transitionStart("/anime/"+ anime.anime.slug)}><abbr title={anime.anime.title}>{anime.anime.title}</abbr></h2>
                                <h4>Genre:
                                    {#each anime.anime.genre as genre}
                                        <!-- svelte-ignore a11y-missing-attribute -->
                                        <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                                    {/each}
                                </h4>
                                <p>{@html anime.anime.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row-2">
                        <div on:click={() => transitionStart("/anime/"+ anime.anime.slug + "/" + anime.number)} class="thumbnail">
                            {#if anime.image != null}
                                <img class="video-img" src="{anime.image}" alt="Episode Thumbnail">
                                <img class="play" src="/images/play.png" alt="">
                            {:else}
                                <img class="video-img" src="{anime.anime.coverImage}" alt="Episode Thumbnail">
                                <img class="play" src="/images/play.png" alt="">
                            {/if} 
                        </div>
                        <h3>Epiode {anime.number}</h3>
                    </div>
                    <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                </div>
            </li>
        {/each}
    </ul>  
    {/each}
{/await}

<style lang="scss">
    $item-width: 170px; 
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
    ul {
        display: grid;
        grid-template-columns: repeat(5, 1fr); 
        column-gap: 1rem;
        transition: 0.3s ease-out;
        margin-bottom: 1.5rem;
        z-index: 1;
        position: relative;

        li {
            display: flex;
            justify-content: center;
        }

        .item {
            position: relative;
            width: $item-width;
            transition: 0.3s ease-out;
            animation: popIn;
            animation-duration: 0.8s;
            animation-timing-function: ease-in-out;
            animation-fill-mode: forwards;
            opacity: 0;

            &:hover {
                width: calc($item-width * 2.1);
                
                .row-1 {
                    width: calc($item-width * 2.1);
                }
                .bg {
                    width: calc(($item-width * 2.1) + 0.3rem);
                    height: calc(206px * 2.22);
                }
                .row-2 .thumbnail {
                    width: calc($item-width * 2);
                    height: 200px;
                    margin-bottom: 0.3rem;
                    margin-top: 0.3rem;
                }
            }

            .row-1 {
                background-color: $dark; 
                display: flex;
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), 100% 100%, 0 100%, 0% 1.5rem);
                width: $item-width; 
                height: 206px;
                transition: 0.3s ease-out;
                
                .col-1 { 
                    background-color: $dark; 
                    width: $item-width;
                    aspect-ratio: 7/8.5; 
                    transition: 0.3s ease-out;
                    cursor: pointer;

                    img {
                        display: block;
                        clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                        width: $item-width;
                        height: 206px;
                        object-fit: cover;
                    }
                }

                .col-2 {
                    width: calc($item-width * 2.1);
                    background-color: $dark;
                    height: 206px;
                    transition: 0.3s ease-out;

                    .info {
                        margin-left: 0.75rem;
                    }

                    h2 {
                        letter-spacing: 1px;
                        width: calc($item-width - 1rem);
                        font-family: 'Noto Serif Georgian', sans-serif;
                        font-size: 1.2rem;
                        color: white;
                        font-weight: 700;
                        margin-top: 0.4rem;
                        margin-bottom: 0.2rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        cursor: pointer;
                    }
                    h4 {
                        line-height: 1.2;
                        width: calc($item-width - 1rem);
                        font-family: 'Quicksand', sans-serif;
                        font-size: 1rem;
                        font-weight: normal;
                        color: rgba(255, 255, 255, 0.9);
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        -webkit-box-orient: vertical;
                        overflow: hidden;

                        a {
                            transition: 0.15s ease-out;
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
                        width: calc($item-width - 1rem);
                        font-family: 'Quicksand', sans-serif;
                        font-size: 1rem;
                        color: rgba(255, 255, 255, 0.6);
                        display: -webkit-box;
                        -webkit-line-clamp: 5;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
            }
            
            .row-2 {
                display: grid;
                grid-template-columns: 1fr;
                background-color: $dark; 
                padding: 0.3rem;
                transform: translateY(-1px);
                clip-path: polygon(0% 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                transition: 0.25s ease-out;
                place-items: center;

                .thumbnail {
                    position: relative;
                    width: 0;
                    height: 0;
                    transition: 0.3s ease-out; 

                    &:hover {
                        cursor: pointer;
                        .play {
                            opacity: 1;
                        }
                    }
                }
                .video-img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    transition: 0.3s ease-in-out;
                    object-fit: cover;
                    object-position: center;
                }
                .play {
                    position: absolute;
                    top: calc(50%);
                    left: calc(50%);
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    width: 40px;
                    user-select: none;
                    transition: 0.3s ease-in-out;
                }
                h3 {
                    padding: 0.1rem;
                    padding-bottom: 0.2rem;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 1.2rem;
                    color: white;
                    font-weight: normal;
                    text-align: center;
                }
            }

            .bg {
                background-size: cover;
                clip-path: polygon(1.5rem 0%, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%, 0% 1.5rem);
                position: absolute;
                top: 0;
                transform: translate(-0.15rem, -0.15rem);
                width: calc($item-width + 0.3rem);
                height: calc(($item-width * 10/7) + 0.325rem);
                background-color: red;
                z-index: -1;
                transition: 0.3s ease-out;
            }
            .gold {
                background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
            }
            .crimson {
                background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);   
            }
        }
        .back-light {
            filter: drop-shadow(0 0 4px $crimsonDark);

            &:hover {
                filter: drop-shadow(0 0 8px $crimsonBright);
            }
        }
    }
</style>