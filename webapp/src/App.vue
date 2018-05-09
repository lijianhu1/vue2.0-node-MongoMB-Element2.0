<template>
  <div id="app">
    <nav-header ref="navHead"></nav-header>
    <router-view/>
  </div>
</template>

<script type='es6'>
import NavHeader from './components/NavHeader.vue'
export default {
  name: 'app',
  components: {
    NavHeader
  },
  mounted () {
  }
}
</script>
<style>
  @import './assets/scss/base.scss';

</style>
