<script>
	import { goto } from '$app/navigation';

// @ts-nocheck

	import { onMount } from 'svelte';
    import { THEME } from '../stores';
	import BgVideo from './BgVideo.svelte';
	import MediaQuery from './MediaQuery.svelte';
	import SearchBar from './SearchBar.svelte';

    /**
	 * @type {number}
	 */
    let currentTheme;
    /**
	 * @type { boolean }
	 */
     export let haveSearch;

    THEME.subscribe(value => {
        currentTheme = value;
    })

    onMount(() => {
        if(currentTheme == 0) {
            // @ts-ignore
            document.getElementById('crimson-music').pause();
            // @ts-ignore
            document.getElementById('gold-music').play();
        }
        else {
            // @ts-ignore
            document.getElementById('gold-music').pause();
            // @ts-ignore
            document.getElementById('crimson-music').play();
        }
    })
    
    /**
* @param {any} _theme
*/
    function setTheme(_theme) { 
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 1;
        setTimeout(() => {
            THEME.set(_theme);
            if(_theme == 0) {
                // @ts-ignore
                document.getElementById('crimson-music').pause();
                // @ts-ignore
                document.getElementById('gold-music').play();
            }
            else {
                // @ts-ignore
                document.getElementById('gold-music').pause();
                // @ts-ignore
                document.getElementById('crimson-music').play();
            }
            // @ts-ignore
            document.getElementById('transition-screen').style.opacity = 0;
        }, 1500);
    }  
    
    function goHome() {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 1;
        setTimeout(() => {
            goto('/home');
        }, 1500);
    }
</script>



<main>  
    <BgVideo/>
    <MediaQuery query="(min-width: 1281px)" let:matches>
        {#if matches}
        <nav>
            <h1 on:click={() => goHome()}>
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
            </h1>
            <div style="display: flex;">
                <SearchBar/>
                <section>
                    <div class="theme" class:active={currentTheme == 0}>
                        <div on:click={() => {setTheme(0)}} id="gold"></div>
                    </div>
                    <div class="line"></div>
                    <div class="theme" class:active={currentTheme == 1}>
                        <div on:click={() => {setTheme(1)}} id="crimson"></div>
                    </div>
                </section>
            </div>
        </nav>
        {/if}
    </MediaQuery>
    
    <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
        {#if matches}
        <nav class="tablet">
            <h1 on:click={() => goHome()}>
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
            </h1>
            <div style="display: flex;">
                <SearchBar/>
                <section>
                    <div class="theme" class:active={currentTheme == 0}>
                        <div on:click={() => {setTheme(0)}} id="gold"></div>
                    </div>
                    <div class="line"></div>
                    <div class="theme" class:active={currentTheme == 1}>
                        <div on:click={() => {setTheme(1)}} id="crimson"></div>
                    </div>
                </section>
            </div>
        </nav>
        {/if}
    </MediaQuery>
    
    <MediaQuery query="(max-width: 480px)" let:matches>
        {#if matches}
        <nav class="mobile">
            <h1 on:click={() => goHome()}>
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
                <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
            </h1>
            <div style="display: grid; place-items: center;">
                <section>
                    <div class="theme" class:active={currentTheme == 0}>
                        <div on:click={() => {setTheme(0)}} id="gold"></div>
                    </div>
                    <div class="line"></div>
                    <div class="theme" class:active={currentTheme == 1}>
                        <div on:click={() => {setTheme(1)}} id="crimson"></div>
                    </div>
                </section>
                {#if haveSearch}
                    <SearchBar/>
                {/if}
            </div>
        </nav>
        {/if}
    </MediaQuery>
</main>

<style lang="scss"> 
    main {
        width: 100vw;
    }
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        padding-left: 18%;
        padding-right: 18%;

        h1 {
            user-select: none;
            cursor: pointer;
            font-size: 2.6rem;
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
    }
    section {
        margin-left: 2rem;
        display: flex;
        align-items: center;
        filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.3));
    }
    .theme {
        background-color: rgb(36, 36, 36);
        border-radius: 50%;
        height: 26px;
        width: 26px;
        display: grid;
        place-items: center;
        cursor: pointer;

        #gold {
            background: linear-gradient($goldDark,$goldBright,$goldDark);
            border-radius: 50%;
            height: 20px;
            width: 20px;
            transition: 0.25s ease-in-out;
            filter: brightness(0.6);

            &:hover {
                filter: brightness(1);
                transform: scale(0.8);
            }
            &:active {
                filter: brightness(1);
                transform: scale(1);
            }
        }

        #crimson {
            background: linear-gradient(rgb(204, 0, 17), rgb(255, 57, 57), rgb(204, 0, 17));
            border-radius: 50%;
            height: 20px;
            width: 20px;
            transition: 0.25s ease-in-out; 
            filter: brightness(0.6);

            &:hover {
                filter: brightness(1);
                transform: scale(0.8);
            }
            &:active {
                filter: brightness(1);
                transform: scale(1);
            }
        } 
    }
    .theme.active {
        #gold, #crimson {
            filter: brightness(1);
        }
    }
    .line {
        width: 20px;
        height: 3px;
        background-color: rgb(36, 36, 36);
    }
    nav.tablet {
        padding-left: 1.5rem;
        padding-right: 1.5rem;

        .line {
            width: 10px;
            height: 3px;
            background-color: rgb(36, 36, 36);
        }
    }
    nav.mobile {
        width: calc(100% - 1rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        row-gap: 1rem;
        padding: 0;

        h1 {
            padding-top: 1rem;
        }

        section {
            margin: 0;
        }
    }
</style>