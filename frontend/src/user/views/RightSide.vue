<template>
    <div class="rightside rightW">
        <div class="top midH"></div>
        <div class="bot botH"></div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped lang="scss">
@charset "utf-8";
@import '../assets/css/pubvar.scss';
.rightside {
    border-left: 1px solid $borderColor1;
    > .top {
        border-bottom: 1px solid $borderColor1;
        box-sizing: border-box;
    }
}
</style>
