<template lang="html">
    <div class="app-container">
        <img src="../image/stuff.svg" alt="">

        <div class="container">
            <div class="item1"></div>
            <div class="item2"></div>
            <div class="item3"></div>
            <div class="item4"></div>
        </div>

        <message></message>
        <controller></controller>

        <router-view></router-view>
    </div>
</template>

<script>
import Message from './Message.vue';
import Controller from './Controller.vue';

export default {
    components: {
        Message,
        Controller,
    },
};
</script>

<style lang="scss">
@import "../style/reset";
@import "../style/mixin";

@include font-face("Lato-Regular");

:root{
    --color1: red;
    --color2: blue;
}

@media (max-width: 1000px) {
    :root{
        --color1: green;
    }
}

.app-container{
    // background-color: var(--color1);

    &:hover{
        // background-color: var(--color2);
    }

    img{
        width: 200px;
    }
}

.container{
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    height: 500px;

    .item1{
        grid-row: 1 / 2;
        grid-column: 1 / 5;
        background-color: red;
    }
    .item2{
        grid-row: 2 / 3;
        grid-column: 1 / 3;
        background-color: yellow;
    }
    .item3{
        grid-row: 2 / 3;
        grid-column: 4 / 5;
        background-color: blue;
    }
    .item4{
        grid-row: 3 / 4;
        grid-column: 1 / 5;
        background-color: green;
    }
}


</style>
