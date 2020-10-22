<template>
    <div class="leftside leftW">
        <div class="top midH">
            <h2>信息栏导航</h2>
            <p
                v-for="item of state.titles"
                :class="{ actived: item.actived }"
                :key="item.id"
            >
                {{ item.text }}
            </p>
        </div>
        <div class="bot botH"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive } from 'vue'
    const titles = [
        { id: 0, text: '医院介绍', componentName: '' },
        { id: 1, text: '疾病科室', componentName: '' },
        { id: 2, text: '医生团队', componentName: '' },
        { id: 3, text: '文章列表', componentName: '' },
        { id: 4, text: '活动列表', componentName: '' }
    ]

    export default defineComponent({
        setup() {
            const state = reactive({
                titles
            })
            return { state }
        }
    })
</script>

<style scoped lang="scss">
    @charset "utf-8";
    @import '../assets/css/pubvar.scss';

    .leftside {
        background: #f2f6f7;
        > .top {
            font-size: 16px;
            box-sizing: border-box;
            padding: 0 21px;
            text-align: center;
            border-bottom: 1px solid $borderColor1;
            > h2 {
                padding: 21px 0 20px;
                border-bottom: 1px solid $borderColor1;
                margin-bottom: 15px;
            }
            > p {
                color: #555;
                margin-bottom: 30px;
                cursor: pointer;
                &:active {
                    font-weight: bolder;
                    color: #000;
                }
            }
        }
    }
</style>
