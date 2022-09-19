<script>
    // @ts-nocheck
    import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Popular from '$lib/components/Popular.svelte';
    import Recent from '$lib/components/Recent.svelte';

    import { onMount } from 'svelte';

    onMount(() => {

        setTimeout(() => {
            document.getElementById('transition-screen').style.transition = "1s ease-in";
            document.getElementById('transition-screen').style.opacity = 0;
            setTimeout(() => {
                document.getElementById('transition-screen').style.transition = "0s";
                document.getElementById('transition-screen').style.zIndex = -2;
            }, 1000);
        }, 1000);
    });
</script>

<main>
    <BgVideo/>
    <Nav/>
    <div class="grid">
        <Popular/>
        <Recent/>
    </div>
</main>

<style lang="scss" scoped> 
    
</style>