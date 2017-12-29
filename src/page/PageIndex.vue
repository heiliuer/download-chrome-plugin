<template>
    <div id="searchPage" class="searchPage page" style="display:block;">
        <div style="padding: 20px;">
            <input type="text" v-model="key" placeholder="输入关键字" style="padding: 5px;">
            <span style="font-size: 12px;color:#999;margin-left: 20px;">
                注：立即下载 &gt; 点击右键 &gt; 链接另存为 &gt;
                <a href="chrome://extensions/" target="chrome://extensions/"
                   style="color:#4d90fe;">chrome://extensions/</a>
            </span>
        </div>
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
    export default {
        name: "page-index",
        data() {
            return {
                key: '',
                items: null,
                loading:true
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
                vm.items=null
                vm.loading=true
                fetch(
                    `http://extension.browser.qq.com/search_v3?key=${key}`,
                    {method: 'get'}
                ).then(res => res.json()).then(json => {
                    console.log(json)
                    const itemList = json['result_list']['value'].map(item => JSON.parse(item['doc_meta']))
                    console.log(itemList)
                    vm.items = itemList
                    vm.loading=null
                }).catch(res => {
                    vm.loading=false
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
                this.fetchDataD()
            }
        }
    }
</script>

<style></style>