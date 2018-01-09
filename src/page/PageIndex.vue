<template>
    <div class="searchPage page">
        <div style="padding: 20px;">
            <input type="text" v-model="key" placeholder="输入插件名或者其他关键字" style="padding: 5px;width: 200px;">
            <a href="#/help" style="margin-left: 10px;color:#555;">使用帮助</a>
        </div>
        <ul ref="scrollUL">
            <li class="app-tag search-row" v-for="item in items">
                <div class="search-info">
                    <img class="searchLogo" :src="item.RIB" alt="">
                    <div class="search-row-right">
                        <p class="title" v-text="item.TA">Vue.js devtools</p>
                        <p class="search-desc" v-text="item.TB">
                            Chrome and Firefox DevTools extension for debugging Vue.js applications.
                        </p>
                    </div>
                </div>
                <a :href="item.RIF" target="_parent" class="install subtle"></a>
            </li>
            <li style="width:1170px;padding:0;margin:0;">
                <p style="color: #555;text-align: center;width: 100%;" v-show="loading">正在加载...</p>
                <p v-show="!loading&&items&&items.length===0&&!!key"
                   style="color: #500;text-align: center;width: 100%;">
                    没有找到相关插件</p>
            </li>
        </ul>
    </div>
</template>

<script>
    function log() {
        // console.log(...arguments)
    }

    export default {
        name: "page-index",
        data() {
            return {
                key: 'vue',
                items: null,
                loading: false,
                pageNum: 0
            }
        },
        methods: {
            fetchData() {
                const vm = this
                const {key} = this
                this.loading = true
                if (this._fetchDataFlag) this._fetchDataFlag.cancel = true
                const fetchDataFlag = this._fetchDataFlag = {
                    cancel: false
                }
                const pageNum = this.pageNum++
                fetch(`http://extension.browser.qq.com/search_v3?key=${key}&pageNum=${pageNum}`, {method: 'get'})
                    .then(res => res.json()).then(json => {
                    if (!!fetchDataFlag.cancel) return
                    if (json['result_num'] == 0 && pageNum > 0) {
                        vm.pageNum = -1
                    } else {
                        // log(json)
                        const itemList = json['result_list']['value'].map(item => JSON.parse(item['doc_meta']))
                        log(itemList)
                        vm.items = (vm.items || []).concat(itemList)
                    }
                    vm.loading = null
                }).catch(res => {
                    if (!!fetchDataFlag.cancel) return
                    vm.loading = false
                    console.error(res)
                })
            },
            handlerScroll(event) {
                const scrollEl = event.target
                const {scrollTop, scrollHeight, offsetHeight} = scrollEl
                if (scrollHeight - offsetHeight - scrollTop < offsetHeight * 0.5) {
                    this.fetchDataD()
                }
            }
        },
        beforeCreate() {
            this.fetchDataD = this._.debounce(() => {
                if (!this.key) return
                this.fetchData()
            }, 100)
        },
        created() {
            this.fetchDataD()
        },
        mounted() {
            this.$refs['scrollUL'].onscroll = this._.debounce(event => {
                if (this.loading && this.pageNum == -1) return
                this.handlerScroll(event)
            }, 100)
        },
        watch: {
            key() {
                const scrollUL = this.$refs['scrollUL']
                if(scrollUL){
                    scrollUL.scrollTop = 0
                }
                this.items = null
                this.pageNum = 0
                this.fetchDataD()
            }
        }
    }
</script>

<style></style>