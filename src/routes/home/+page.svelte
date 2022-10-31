<script>
    import BgVideo from '$lib/components/BgVideo.svelte';
	import MediaQuery from '$lib/components/MediaQuery.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Popular from '$lib/components/Popular.svelte';
    import Recent from '$lib/components/Recent.svelte';
	import { THEME } from '$lib/stores';

    import { onMount } from 'svelte';

    let recentPage = 1;
    /**
	 * @type {number}
	 */
    let currentTheme;

    THEME.subscribe(value => {
        currentTheme = value;
    })

    onMount(() => {
        setTimeout(() => {
            // @ts-ignore
            document.getElementById('transition-screen').style.opacity = 0;
        }, 1000)
    });

    /**
	 * @param {boolean} next
	 */
    function nextPage(next) {
        if(next) recentPage++;
        else recentPage--;
    }
    function resetPage() {
        recentPage = 1;
    }
</script>


<MediaQuery query="(min-width: 1281px)" let:matches>
    {#if matches}
    <Popular/>
    <main>
        <div class="recent">
            <div class="container">
                <div class="grid">
                    <h1 on:click={resetPage}><span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>R</span>ecent</h1>
                </div>
            </div>
            <div class="container" style="padding-bottom: 2rem">
                <div class="grid">
                    <Recent/>
                </div>
            </div> 
        </div>
    </main>
    {/if}
</MediaQuery>

<MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
    {#if matches}
    <main class="tablet">
        <Popular/>
        <div class="recent">
            <div class="container">
                <div class="grid">
                    <h1 on:click={resetPage}><span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>R</span>ecent</h1>
                </div>
            </div>
            <div class="container" style="padding-bottom: 2rem">
                <div class="grid">
                    <Recent/>
                </div>
            </div> 
        </div>
    </main>
    {/if}
</MediaQuery>

<MediaQuery query="(max-width: 480px)" let:matches>
    {#if matches}
    <main class="mobile">
        <Popular/>
        <div class="recent">
            <div class="container">
                <div class="grid">
                    <h1 on:click={resetPage}><span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>R</span>ecent</h1>
                </div>
            </div>
            <div class="container" style="padding-bottom: 2rem">
                <div class="grid">
                    <Recent/>
                </div>
            </div> 
        </div>
    </main>
    {/if}
</MediaQuery>

<style lang="scss" scoped>
    .recent {
        background: rgba(36, 36, 36, 0.95);
    }
    main {
        width: 100vw;
        min-height: 110vh;
    }
    h1 {
        cursor: pointer;
        user-select: none;
        font-family: 'Fandango Bold', sans-serif;
        font-size: 2rem;
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
    .grid {
        position: relative;
        width: 1100px;
        animation: DropIn;
        animation-duration: 1.25s;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        opacity: 0;
        margin: 0 auto;
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
    h5 {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        text-align: center;
        font-family: 'Quicksand', sans-serif;
        font-size: 1rem;
        color: white;
        font-weight: normal;
    }
    .page-control {
        position: absolute;
        height: 820px;
        width: 100%;
        top: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 0;
        
        button {
            cursor: pointer;
            background: transparent;
            color: white;
            
            span {
                transition: 0.15s ease-in-out;
                font-size: 2.5rem;
            }

            &:hover {
                .gold {
                    transform: scale(1.2);
                    color: $goldDark;
                }
                .crimson {
                    transform: scale(1.2);
                    color: $crimsonDark;
                }
            }
        }
        button.invis {
            pointer-events: none;
            opacity: 0;
        }
        button.prev {
            transform: translateX(-1.6rem);
        }
        button.next {
            transform: translateX(1rem);
        }
    }
    main.tablet {

        .grid { 
            width: calc(100vw - 2rem);
        }

        h1 {
            font-size: 1.6rem;
        }
    }
    main.mobile {

        .grid { 
            width: calc(100vw - 2rem);
        }

        h1 {
            font-size: 1.5rem;
            text-align: center;
        }
    }
</style>