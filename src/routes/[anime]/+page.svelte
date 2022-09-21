<script>
	import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';

    import Youtube from "svelte-youtube-embed";

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

    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);

    /**
	 * @param {number} anime_id
	 */
    async function getYoutubeLink(anime_id) {
        const response = await fetch('https://kitsu.io/api/edge/anime/' + anime_id);
        const kitsu = await response.json();
        return 'https://www.youtube.com/embed/' + kitsu.data.attributes.youtubeVideoId;
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
    async function fixData(anime) {
        const newImgURL = await fixImgURL(anime.bannerImage);
        const newAnimeTitle = await fixAnimeTitle(anime.title);
        anime.bannerImage = newImgURL;
        anime.title = newAnimeTitle;
        return anime;
    }
    async function fetchAnime() {
        console.log("Fetching Anime");
        const response = await fetch('https://api.enime.moe/anime/' + data.anime);
        const result = await response.json();
        let anime = await fixData(await result);
        anime.youtubeVideo = await getYoutubeLink(anime.mappings.kitsu);
        return anime;
    }
</script>

<main>
    <BgVideo/>
    <Nav/>
    <div class="container">
        {#await fetchAnime()}
            <!-- promise is pending -->
        {:then anime}
            <div class="grid">
                <div class="col-1">
                    <img src={anime.coverImage} alt="">
                </div>
                <div class="col-2">
                    <img onclick="this.style.opacity = 0; this.style.pointerEvents = 'none';" src={anime.bannerImage} alt="">
                    <iframe src={anime.youtubeVideo} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
            <h1>{anime.title}</h1>
        {/await}
    </div>
</main>

<style lang="scss"> 
    main {
        width: 100vw;
        min-height: 100vh;
        background: linear-gradient(rgba(36, 36, 36, 0.1),rgba(36, 36, 36, 0.5),rgba(36, 36, 36, 0.8));
    }
    .container {
        margin: auto 18%;
    }
    h1 {
        font-family: 'Noto Serif Georgian', sans-serif;
        font-size: 2rem;
        margin-bottom: 1rem;
        color: white;
        font-weight: bold;
    }
    .grid {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 2fr 5fr;
        column-gap: 1rem;

        .col-1 {
            img {
                width: 100%;
            }
        }
        .col-2 {  
            position: relative;
            img {
                z-index: 1;
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                transition: 0.25s ease-in-out;
            }
            iframe {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }
    }
</style>
