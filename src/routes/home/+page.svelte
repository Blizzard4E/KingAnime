<script>
    // @ts-nocheck
    import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Popular from '$lib/components/Popular.svelte';
    import Recent from '$lib/components/Recent.svelte';

    import { onMount } from 'svelte';

    onMount(() => {
        setTimeout(() => {
            // @ts-ignore
            document.getElementById('transition-screen').style.opacity = 0;
        }, 1000)
    });
</script>

<main>
    <nav>
        <BgVideo/>
        <Nav/>
    </nav>
    <div class="grid">
        <Popular/>
        <Recent/>
    </div>
</main>

<style lang="scss" scoped> 
    main {
        width: 100vw;
        min-height: 110vh;
        scroll-snap-type: y mandatory;
        background: linear-gradient(rgba(36, 36, 36, 0),rgba(36, 36, 36, 0.95), rgba(36, 36, 36, 0.96),rgba(36, 36, 36, 0.99));
    }
    nav {
        margin-bottom: 35vh;
    }
    .grid {
        scroll-snap-align: start;
    }
</style>