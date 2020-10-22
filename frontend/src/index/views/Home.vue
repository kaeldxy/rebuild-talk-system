<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, ref } from 'vue'
    import HelloWorld from '@/components/HelloWorld.vue'
    import { Ikefu } from 'MyType'

    export default defineComponent({
        name: 'Home',
        components: {
            HelloWorld
        },
        props: {
            user: String
        },
        setup(prop) {
            const state = reactive({
                count: 0,
                str: ''
            })
            return state
        }
    })
</script>
