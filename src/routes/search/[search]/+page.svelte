<script>
	import { THEME } from '$lib/stores';
	import { onMount } from 'svelte';

    let currentTheme;
    
    THEME.subscribe(value => {
        currentTheme = value;
    })

    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);

    onMount(() => {
        // @ts-ignore
        document.getElementById('transition-screen').style.opacity = 0;
    });
</script>

