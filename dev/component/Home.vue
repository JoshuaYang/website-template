<template lang="html">
    <div class="home">
        <div class="stuff preload" data-source="../image/stuff.svg"></div>
    </div>
</template>

<script>
import PictureLoader from 'joshua-picture-loader';

export default {
    mounted() {
        new PictureLoader().load();
    },
};
</script>

<style lang="scss">
.home {
    .stuff {
        width: 200px;
    }
}
</style>
