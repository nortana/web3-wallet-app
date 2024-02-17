import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).mount('#app')

app.config.globalProperties.$wssGoerliTest = 'wss://goerli.infura.io/ws/v3/dc92288a859d445890ede39d9dba5861'

