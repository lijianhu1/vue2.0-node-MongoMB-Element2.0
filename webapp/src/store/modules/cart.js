const state = {
  cartCount: 0
}
const mutations = {
  updateCartCount (state, count) {
    state.cartCount += count
  },
  initCartCount (state, count) { // 初始化数据
    state.cartCount = count
  }
}

export default {
  state,
  mutations
}
