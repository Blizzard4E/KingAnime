<script>
    // @ts-nocheck
    import { THEME } from '../stores';
     
    /**
	 * @type {number}
	 */
    let currentTheme;
    let volume = 0.025;

    THEME.subscribe(value => {
        currentTheme = value;  
    }) 
</script>

{#if currentTheme == 0}
    <video src="/videos/overlord-0.mp4" autoplay loop muted></video>   
    <!-- @ts-ignore -->
     <audio onloadstart="this.volume = {volume}" src="/audios/overlord-0.mp3" autoplay loop></audio> 
{:else}
    <video src="/videos/overlord-1.mp4" autoplay loop muted></video> 
    <!-- @ts-ignore -->
    <audio onloadstart="this.volume = {volume}" volume={volume} src="/audios/overlord-1.mp3" autoplay loop></audio>
{/if} 
<div class="bg"></div>

<style lang="scss">
    video {
        width: 100%;
        height: 100vh;
        object-fit: cover;
        object-position: left top;
        position: fixed;
        z-index: -2;
    }
    .bg {
        position: fixed;
        width: 100%;
        height: 100vh;
        background: linear-gradient(transparent,rgba(36, 36, 36, 0.5), rgba(36, 36, 36, 0.9),rgba(36, 36, 36, 1));
        z-index: -1;
        transition: 0;
    }
</style>