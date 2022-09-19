<script>
	import { THEME } from '$lib/stores'; 
    /**
	 * @type {number}
	 */
    let currentTheme;

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
            anime.image = newImgURL;
            anime.anime.title = newAnimeTitle;
        }
        return animes;
    }
    async function fetchRecent() {
        console.log("Fetching Recent Animes");
        const response = await fetch('https://api.enime.moe/recent');
        const result = await response.json(); 
        const animes = fixData(await result.data);
        return animes;
    }
</script>

<main>
    {#await fetchRecent()}
        <!-- promise is pending -->
    {:then animes}
    <div class="grid">
        <h1><span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>R</span>ecent</h1>
        <ul>
            {#each animes as anime}
                <li class:back-light={currentTheme == 1}>
                    <a href="{"/"+ anime.anime.slug}" class="row-1">
                        <div class="col-1">
                            <img src="{anime.anime.coverImage}" alt="">
                        </div>
                        <div class="col-2">
                            <div class="info">
                                <h2><abbr title={anime.anime.title}>{anime.anime.title}</abbr></h2>
                                <h4>Genre:
                                    {#each anime.anime.genre as genre}
                                        <!-- svelte-ignore a11y-missing-attribute -->
                                        <a class:gold-genre={currentTheme == 0} class:crimson-genre={currentTheme == 1}>{" " + genre}</a>
                                    {/each}
                                </h4>
                                <p>{@html anime.anime.description}</p>
                            </div>
                        </div>
                    </a>
                    <div class="row-2">
                        <a href="../" class="thumbnail">
                            {#if anime.image != null}
                                <img class="video-img" src="{anime.image}" alt="Episode Thumbnail">
                                <img class="play" src="/images/play.png" alt="">
                            {:else}
                                <div class="center"><h5>No Thumbnail</h5></div>
                                <img class="play" src="/images/play.png" alt="">
                            {/if} 
                        </a>
                        <h3>Epiode {anime.number}</h3>
                    </div>
                    <div class="bg" class:gold={currentTheme == 0} class:crimson={currentTheme == 1}></div>
                </li>
            {/each}
        </ul>  
    </div>
    {/await}
</main>

<style lang="scss">
    $item-width: 170px;
    main {
        width: 100vw;
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.5),rgba(36, 36, 36, 0.8));
    }
    .grid {
        width: 1400px;
        padding: 1rem;
        margin-left: 17.5%;
        margin-right: 20%;
        overflow: hidden;
        animation: DropIn;
        animation-duration: 1.25s;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        transform: translateY(50%);
        opacity: 0;
    }
    @keyframes DropIn {
        0%  {
            transform: translateY(50%);
            opacity: 0;
        }
        40% {
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
    h1 {
        user-select: none;
        font-family: 'Fandango Bold', sans-serif;
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: white;
        font-weight: normal;
        filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
        span {
            font-family: 'Seagram', sans-serif;
        }
        .gold {
            background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .crimson {
            background: linear-gradient($crimsonDark, $crimsonDark, $crimsonBright, $crimsonDark, $crimsonDark);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        column-gap: 2rem;
        row-gap: 2rem;
        transition: 0.3s ease-out;
        margin-right: 1.289%; 

        li {
            position: relative;
            width: $item-width;
            transition: 0.3s ease-out;

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
                .row-2 .thumbnail h5 {
                    opacity: 1;
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
                transition: 0.25 ease-out;
                place-items: center;

                .thumbnail {
                    position: relative;
                    width: 0;
                    height: 0;
                    transition: 0.3s ease-out; 

                    &:hover {
                        cursor: pointer;
                        .video-img, h5 {
                            filter: brightness(0.7);
                        }
                        .play {
                            opacity: 1;
                        }
                    }

                    .center {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }

                    h5 {
                        font-family: 'Quicksand', sans-serif;
                        font-size: 2rem;
                        font-weight: normal;
                        opacity: 0;
                        color: white;
                        transition: 0.3s ease-in-out;
                    }
                }
                .video-img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    transition: 0.3s ease-in-out;
                    object-fit: cover;
                }
                .play {
                    position: absolute;
                    top: calc(50%);
                    left: calc(50%);
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    width: 50px;
                    height: 50px;
                    user-select: none;
                    transition: 0.3s ease-out;
                }
                h3 {
                    padding: 0.15rem;
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