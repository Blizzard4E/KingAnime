<script>
    import { goto } from '$app/navigation';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
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
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
    })
    /**
    * @param {string} path
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
    <MediaQuery query="(min-width: 1281px)" let:matches>
        {#if matches}
        <div class="root default" on:click={() => transitionStart('/home')}>
            <div>
                <h1>
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
                </h1>
                <h2>Welcomes you.</h2>
                <p>Click anywhere to start</p>
            </div>
        </div>
        {/if}
    </MediaQuery>
    
    <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
        {#if matches}
        <div class="root tablet" on:click={() => transitionStart('/home')}>
            <div>
                <h1>
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
                </h1>
                <h2>Welcomes you.</h2>
                <p>Click anywhere to start</p>
            </div>
        </div>
        {/if}
    </MediaQuery>
    
    <MediaQuery query="(max-width: 480px)" let:matches>
        {#if matches}
        <div class="root mobile" on:click={() => transitionStart('/home')}>
            <div>
                <h1>
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                    <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
                </h1>
                <h2>Welcomes you.</h2>
                <p>Click anywhere to start</p>
            </div>
        </div>
        {/if}
    </MediaQuery>
</main>

<style lang="scss">
    video {
        display: none;
    }
    h1 {
        user-select: none;
        cursor: pointer;
        font-size: 4rem;
        color: white;
        font-weight: normal;
        font-family: 'Seagram',sans-serif;

        .gold {
            background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .crimson {
            background: linear-gradient(rgb(204, 0, 17), rgb(204, 0, 17), rgb(255, 57, 57), rgb(204, 0, 17), rgb(204, 0, 17));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        span {
            &:nth-child(2) {
                margin-left: -0.5rem;
            }
        }
    }
    h2 {
        font-size: 2rem;
        font-family: 'Noto Serif Georgian', sans-serif;
        color: white;
        text-align: center;
        font-weight: normal;
    }
    p {
        margin-top: 1rem;
        font-size: 1.1rem;
        font-family: 'Quicksand', sans-serif;
        color: white;
        text-align: center;
    }
    .root {
        display: grid;
        width: 100vw;
        height: 100vh;
        place-items: center;

        div {
            display: grid;
            place-items: center;
        }
        img {
            margin-top: 5rem;
            transition: 0.25s ease-out;
            cursor: pointer;
            &:hover {
                transform: scale(1.1);
            }
        }
    }
    .tablet {
        h1 {
            font-size: 5rem;
        }
        h2 {
            font-size: 2rem;
        }
        p {
            font-size: 1.2rem;
        }
    }
    .default {
        h1 {
            font-size: 7rem;
        }
        h2 {
            font-size: 3rem;
        }
        p {
            font-size: 1.5rem;
        }
    }
</style>