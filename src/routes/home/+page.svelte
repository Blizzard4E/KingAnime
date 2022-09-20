<script>
    // @ts-nocheck
    import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Popular from '$lib/components/Popular.svelte';
    import Recent from '$lib/components/Recent.svelte';

    import { onMount } from 'svelte';

    onMount(() => {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
        console.log("Opacity 0")
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
        scroll-snap-type: y mandatory;
    }
    nav {
        margin-bottom: 35vh;
    }
    .grid {
        scroll-snap-align: start;
    }
</style>