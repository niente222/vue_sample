<template>
  <myHeader />
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
  <myFooter />
</template>

<script>
  import myHeader from './components/layout/header.vue'
  import myFooter from './components/layout/footer.vue'

  export default {
  components: { 
    myHeader,
    myFooter
    }
  };
</script>