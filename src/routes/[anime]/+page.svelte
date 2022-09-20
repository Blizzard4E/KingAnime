<script>
	import BgVideo from '$lib/components/BgVideo.svelte';
    import Nav from '$lib/components/Nav.svelte';


    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);
</script>

<main>
    <BgVideo/>
    <Nav/>
</main>

<style lang="scss">
    .bg {
        position: absolute;
        top: 0;
        width: 100vw;
        height: 50vh;
        background: url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg');
        background-size: cover;
        z-index: -1;
    }
</style>
