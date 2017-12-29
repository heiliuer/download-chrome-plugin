<template>
    <div id="searchPage" class="searchPage page" style="display:block;">
        <div style="padding: 20px;">
            <input type="text" v-model="key" placeholder="输入插件名或者其他关键字" style="padding: 5px;width: 200px;"> <a
                href="#/help" style="margin-left: 10px;color:#555;">使用帮助</a>
        </div>
        <p style="color: #555;text-align: center;width: 100%;" v-show="loading">正在加载...</p>
        <p v-show="!loading&&items&&items.length===0&&!!key" style="color: #500;text-align: center;width: 100%;">没有找到相关插件</p>
        <ul id="searchList" style="display: block;">
            <li class="app-tag search-row" v-for="item in items">
                <div class="search-info">
                    <img class="searchLogo"
                         :src="item.RIB"
                         alt="">
                    <div class="search-row-right"><p class="title" v-text="item.TA">Vue.js devtools</p>
                        <p class="search-desc" v-text="item.TB">Chrome and Firefox DevTools extension for debugging
                            Vue.js
                            applications.</p></div>
                </div>
                <a :href="item.RIF"
                   target="_parent" class="install subtle"></a></li>
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
                key: '',
                items: null,
                loading: false
            }
        },
        methods: {
            fetchData1() {// 有跨域问题
                const vm = this
                const {key} = this
                vm.axios.get('/search_v3', {
                    // url参数
                    params: {
                        key
                    },
                    data: {},
                    withCredentials: false
                }).then(res => {
                    //vm.fetchedData = res
                }).catch(res => {
                })
            },
            fetchData() {
                const vm = this
                const {key} = this
                vm.loading = true
                if (this._fetchDataFlag) {
                    this._fetchDataFlag.cancel = true
                    log('cancel begin')
                }
                const fetchDataFlag = this._fetchDataFlag = {
                    cancel: false
                }
                fetch(
                    `http://extension.browser.qq.com/search_v3?key=${key}`,
                    {method: 'get'}
                ).then(res => res.json()).then(json => {
                    if (!!fetchDataFlag.cancel) {
                        log('cancel finished')
                        return
                    }
                    log(json)
                    const itemList = json['result_list']['value'].map(item => JSON.parse(item['doc_meta']))
                    log(itemList)
                    vm.items = itemList
                    vm.loading = null
                }).catch(res => {
                    if (!!fetchDataFlag.cancel) {
                        return
                    }
                    vm.loading = false
                    console.error(res)
                })
            }
        },
        beforeCreate() {
            this.fetchDataD = this._.debounce(() => this.fetchData(), 100)
        },
        created() {
            const vm = this
            vm.fetchDataD()
        },
        watch: {
            key() {
                this.items = null
                this.fetchDataD()
            }
        }
    }
</script>

<style></style>