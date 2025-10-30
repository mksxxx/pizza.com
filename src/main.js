import { createApp } from 'vue'
import { createPinia } from 'pinia' // 👈 Faltava essa linha
import App from './App.vue'
import router from './router/routes'
import iconSet from 'quasar/icon-set/fontawesome-v6'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Quasar, Notify } from 'quasar'

const app = createApp(App)

// 🔹 Cria e configura o Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 🔹 Registra os plugins
app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: { Notify },
  iconSet: iconSet
})

// 🔹 Monta o app
app.mount('#app')
