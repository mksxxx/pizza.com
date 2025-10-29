import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes'
import iconSet from 'quasar/icon-set/fontawesome-v6'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import { Quasar, Notify } from 'quasar'



const app = createApp(App)

app.use(router)
app.use(Quasar,{
    plugins:{Notify},
  iconSet: iconSet
})
//app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
