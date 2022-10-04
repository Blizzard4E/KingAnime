<script>

</script>

<form on:submit|preventDefault={() => {}}>
    <input type="text" placeholder="Search anime...">
    <span class="material-symbols-outlined search-icon">
    search
    </span>
</form>

<style lang="scss">
    form {
        clip-path: polygon(0.5rem 0%, 100% 0, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0 100%, 0% 0.5rem);
        background-color: rgb(36, 36, 36);
        display: flex;
        align-items: center;
        width: 300px;
        position: relative;

        .search-icon {
            color: rgba(255, 255, 255, 0.5);
            position: absolute;
            right: 0;
            bottom: 0;
            margin-bottom: 0.3rem;
            margin-right: 0.75rem;
            z-index: 1;
            font-size: 1.5rem;
        }

        input {
            background: transparent;
            padding: 0.5rem 1rem;
            width: calc(100% - 3.5rem);
            caret-color: white;
            color: white;
            font-family: 'Quicksand', sans-serif;
            font-size: 0.9rem;
            font-weight: normal;

            &::placeholder {
                color: rgba(255, 255, 255, 0.5);
                background: transparent;
            }
            &:focus {
                outline: none;
            }
        }
    }
</style>