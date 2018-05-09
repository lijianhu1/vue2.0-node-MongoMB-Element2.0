<template>
  <div id="loading" v-show="isShow">
    <div class="loading-con">
      <img src="./loading-spinning-bubbles.svg" alt="">
      <p>loading</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      isShow: true,
      hasAnimate: true
    }
  },
  computed: {
    /**
     * 动画效果样式，没有返回空
     * @return {String} 样式
     */
    animateName () {
      return this.hasAnimate ? 'opacity' : ''
    }
  },
  methods: {
    /**
     * 开启动画效果
     */
    opemAnimate () {
      this.hasAnimate = true
    },
    /**
     * 去除动画效果
     * @return {Promise} 返回promise
     */
    removeAnimate () {
      return new Promise((resolve) => {
        this.hasAnimate = false
        resolve()
      })
    },
    /**
     * 显示动画loading
     */
    show () {
      this.isShow = true
    },
    /**
     * 隐藏动画loading
     */
    hide () {
      this.isShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #loading{
    position: fixed;
    background: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    .loading-con{
      position: absolute;
      top: 50%;
      left: 50%;
      text-align: center;
      p{
        color: #fff;
        font-size: 18px;
        margin-top: 30px;
      }
    }
  }
</style>
