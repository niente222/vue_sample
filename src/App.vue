<template>
  <div id="app">
    <div 
      id="nav" 
      class="tab-area-base">
      <ul class="tab-menu-base">
        <!-- `router.js` で定義したルーティングルールとの紐付けを行っている -->
        <li><router-link to="/">Home</router-link></li>
        <!-- *** -->
        <!-- 省略 -->
        <!-- *** -->
        <li><router-link to="/page2">Rounting Test</router-link></li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

// ▼ ここから削除 ( ルーティングによって不要となるため )
//<script>
//import HelloWorld from './components/HelloWorld.vue'
//
//export default {
//  name: 'App',
//  components: {
//    HelloWorld
//  }
//}
//</script>
// ▲ ここまで削除