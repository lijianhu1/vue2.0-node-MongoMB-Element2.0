import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'

describe('NavHeader.vue', () => {
  it('NavHeader测试', () => {
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
