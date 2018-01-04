<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {}
        },
        created(){
            console.log(this)
        }
    }
</script>

<style scoped>
    #app {
        width: 1190px;
        margin: 0 auto;
        margin-top: 48px;
    }
</style>
