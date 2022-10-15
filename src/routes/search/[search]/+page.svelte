<script>
	import SearchResults from '$lib/components/SearchResults.svelte';
import { THEME } from '$lib/stores';
	import { onMount } from 'svelte';

    let currentTheme;
    let searchedAnime = "";
    /**
	 * @type {HTMLInputElement}
	 */
    let searchValue;
    
    THEME.subscribe(value => {
        currentTheme = value;
    })

    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);

    onMount(() => {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
        searchedAnime = data.search;
        searchValue.value = data.search;
    });
    /**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
    let timer;
    function searchAnime() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            searchedAnime = searchValue.value;
        }, 800);
    }
</script>

<main>
    <div class="container">
        <form on:submit|preventDefault={() => {searchedAnime = searchValue.value;}}>
            <span class="material-symbols-outlined search-icon">
                search
            </span>
            <input on:keydown={searchAnime} bind:this={searchValue} type="text" placeholder="Search Anime...">
        </form>
        <SearchResults searchedName={searchedAnime} page={1}/>
    </div>
</main>

<style lang="scss">
    main {
        width: 100vw;
        min-height: 110vh;
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.8),rgba(36, 36, 36, 0.95), rgba(36, 36, 36, 0.99), rgba(36, 36, 36, 0.99),rgba(36, 36, 36, 0.99));
    }
    .container {
        margin: auto 18%;
    }
    form {
        margin-top: 1rem;
        clip-path: polygon(0.5rem 0%, 100% 0, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0 100%, 0% 0.5rem);
        background-color: rgb(36, 36, 36);
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;

        .search-icon {
            color: rgba(255, 255, 255, 0.5);
            position: absolute;
            left: 0;
            bottom: 0;
            margin-bottom: 0.6rem;
            margin-left: 0.5rem;
            z-index: 1;
            font-size: 1.5rem;
        }

        input {
            margin-left: 1rem;
            background: transparent;
            padding: 0.75rem 1.25rem;
            width: calc(100% - 3.5rem);
            caret-color: white;
            color: white;
            font-family: 'Quicksand', sans-serif;
            font-size: 1rem;
            font-weight: normal;

            &::placeholder {
                color: rgba(255, 255, 255, 0.5);
                background: transparent;
            }
            &:focus {
                outline: none;
            }
        }
    }
</style>