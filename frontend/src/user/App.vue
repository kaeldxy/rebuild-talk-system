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

    export default defineComponent({
        components: {},
        setup(prop, ctx) {}
    })
</script>

<style lang="scss">
    $topHeight: 90px;
    $midHeight: 489px;
    $botHeight: 182px;

    $leftWidth: 171px;
    $midWidth: 694px;
    $rightWidth: 414px;

    $borderColor1: #e4e7f1;

    .container {
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
