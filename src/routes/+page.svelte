<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';


    onMount(() => {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
        // @ts-ignore
        document.getElementById('transition-screen').style.transition = "1s ease-in";
        setTimeout(() => {
            // @ts-ignore
            document.getElementById('transition-screen').style.transition = "none";
            // @ts-ignore
            document.getElementById('transition-screen').style.zIndex = -2;
        }, 1000)
    })
    /**
    * @param {string} path
    */
    function transitionStart(path) {
        // @ts-ignore
        document.getElementById('transition-screen').style.zIndex = 5;
        // @ts-ignore
        document.getElementById('transition-screen').style.transition = "1s ease-in";
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 1;
        setTimeout(sendToPath, 1000, path);
    }
    /**
    * @param {string | URL} path
    */
    function sendToPath(path) {
        goto(path);
    }

</script>

<main>
    <div class="temp">
        <div>
            <h1>Temporary Welcome Page (WIP)</h1>
            <img on:click={() => transitionStart('/home')} src="/images/play.png" alt="">
        </div>
    </div>
</main>

<style lang="scss">
    video {
        display: none;
    }
    .temp {
        display: grid;
        width: 100vw;
        height: 100vh;
        place-items: center;

        div {
            display: grid;
            place-items: center;
        }
        
        h1 {
            font-family: 'Quicksand', sans-serif;
            color: white;
            font-size: 3rem;
        }

        img {
            margin-top: 5rem;
            transition: 0.25s ease-out;
            cursor: pointer;
            filter: drop-shadow(0 0 1rem $crimsonBright);
            &:hover {
                transform: scale(1.1);
                filter: drop-shadow(0 0 1rem $goldBright);
            }
        }
    }
</style>