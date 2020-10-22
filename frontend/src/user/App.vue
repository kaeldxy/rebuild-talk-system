<template>
    <div class="container">
        <main class="main">
            <HeaderModel />
            <div class="rest">
                <LeftSide />
                <MidSide />
                <RightSide />
            </div>
        </main>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import HeaderModel from './views/HeaderModel.vue'
    import LeftSide from './views/LeftSide.vue'
    import MidSide from './views/MidSide.vue'
    import RightSide from './views/RightSide.vue'
    export default defineComponent({
        components: {
            HeaderModel,
            LeftSide,
            MidSide,
            RightSide
        }
    })
</script>

<style lang="scss">
    @charset "utf-8";
    @import './assets/css/pubvar.scss';

    .container {
        min-width: $conMinW;
        min-height: $conMinH;
        width: 100%;
        height: 100vh;
        background-color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .main {
        background-color: #fff;
    }
    .rest {
        display: flex;
    }
</style>
