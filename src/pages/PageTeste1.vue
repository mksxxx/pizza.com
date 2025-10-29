<template>
  <q-layout view="hHh lpR fFf" class="menu-container">

    <q-drawer 
    v-model="leftDrawerOpen" 
    show-if-above 
    side="left" 
    behavior="desktop" 
    :width="90"
    elevated>
      <router-link to="dashboard"><q-icon name="home" size="25px" class="icon"/></router-link>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>

</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>

:root {
  --background: #f8f8f8;
  --sidebar: #fff;
  --icon-color: #222;
  --icon-hover: #1807b0;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 90px;
  background: var(--sidebar);
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}


.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 30px;
}

/* LINKS */
.icons {
  color: var(--icon-color);
  font-size: 22px;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: var(--icon-hover);
  transform: scale(1.15);
}

/* BOTÃO SAIR */
.logout {
  margin-bottom: 25px;
}

#logoutBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}


#logoutBtn i.fa {
  font-size: 20px;
  color: #495057;
}


#logoutBtn:hover {
  color: var(--icon-hover);
}


#logoutBtn:hover i.fa {
  color: var(--icon-hover);
}


#logoutBtn:active {
  opacity: 0.8;
}

</style>