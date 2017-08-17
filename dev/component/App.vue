<template lang="html">
    <div class="app-container">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    components: {
    },
};
</script>

<style lang="scss">
@import "~style/reset";
@import "~style/mixin";

// @include font-face("Lato-Regular");

:root{
    --color1: red;
}

@media (max-width: 1000px) {
    :root{
        --color1: green;
    }
}

.app-container{
    background-color: var(--color1);
}


</style>
