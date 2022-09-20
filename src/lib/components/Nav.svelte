<script>
// @ts-nocheck

	import { onMount } from 'svelte';
    import { THEME } from '../stores';

    /**
	 * @type {number}
	 */
    let currentTheme;

    THEME.subscribe(value => {
        currentTheme = value;
    })

    onMount(() => {
        setTheme(currentTheme);
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
                document.getElementById('crimson-music').pause();
                document.getElementById('gold-music').play();
            }
            else {
                document.getElementById('gold-music').pause();
                document.getElementById('crimson-music').play();
            }
            // @ts-ignore
            document.getElementById('transition-screen').style.opacity = 0;
        }, 1500);
    }  

</script>

<main>  
    <nav>
        <h1>
            <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>K</span>ing  
            <span class:gold={currentTheme == 0} class:crimson={currentTheme == 1}>A</span>nime
        </h1>
        <section>
            <div class="theme" class:active={currentTheme == 0}>
                <div on:click={() => {setTheme(0)}} id="gold"></div>
            </div>
            <div class="line"></div>
            <div class="theme" class:active={currentTheme == 1}>
                <div on:click={() => {setTheme(1)}} id="crimson"></div>
            </div>
        </section>
    </nav>
</main>

<style lang="scss"> 
    main {
        width: 100vw;
        background: linear-gradient(rgba(36, 36, 36, 0.5),rgba(36, 36, 36, 0.3),rgba(36, 36, 36, 0));
    }
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        margin-left: 18%;
        margin-right: 18%;

        h1 {
            font-size: 2.6rem;
            color: white;
            font-weight: normal;
            font-family: 'Seagram',sans-serif;

            .gold {
                background: linear-gradient($goldDark, $goldDark, $goldBright, $goldDark, $goldDark);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .crimson {
                background: linear-gradient(rgb(204, 0, 17), rgb(204, 0, 17), rgb(255, 57, 57), rgb(204, 0, 17), rgb(204, 0, 17));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            span {
                &:nth-child(2) {
                    margin-left: -0.9rem;
                }
            }
        }
    }
    section {
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
</style>