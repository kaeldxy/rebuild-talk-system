import { createApp } from 'vue'
import store from './store/index'
import './assets/css/reset.css'
import App from './App.vue'

createApp(App).use(store).mount('#app')
