<script>
    // @ts-nocheck
    import { THEME } from '../stores';
     
    /**
	 * @type {number}
	 */
    let currentTheme;

    THEME.subscribe(value => {
        currentTheme = value;  
    }) 
</script>

{#if currentTheme == 0}
    <video src="/videos/overlord-0.mp4" autoplay loop muted></video>
{:else}
    <video src="/videos/overlord-1.mp4" autoplay loop muted></video>
{/if} 
<div class="bg"></div>

<style lang="scss">
    video {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        object-position: center;
        position: fixed;
        z-index: -2;
        filter: brightness(0.6);
    }
    .bg {
        position: fixed;
        width: 100%;
        height: 100vh;
        z-index: -1;
        transition: 0;
    }
</style>