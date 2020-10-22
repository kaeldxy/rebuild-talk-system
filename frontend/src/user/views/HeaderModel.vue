<template>
    <header class="header">
        <img src="../assets/img/logo.png" alt="LOGO" />
        <h1>XASDASD医院</h1>
    </header>
</template>

<style scoped lang="scss">
@charset "utf-8";
@import '../assets/css/pubvar.scss';
.header {
    height: $topHeight;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $borderColor1;
    > img {
        display: block;
        border-radius: 50%;
        width: 54px;
        height: 54px;
        margin-right: 11px;
        margin-left: 27px;
    }
    h1 {
        font-size: 17px;
        font-weight: lighter;
        color: #000;
    }
}
</style>
