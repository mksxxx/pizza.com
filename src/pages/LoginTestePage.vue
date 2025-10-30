<script setup>
import logo from '../assets/pizza.com.png'
</script>

<template>
  <form @submit="Login">
    <div class="logo">
       <img :src="logo" alt="Logo">
    </div>
    <div class="form-container">
      <p>Digite suas credenciais para realizar o login</p>
    </div>
    <div class="form-container">
      <q-input outlined v-model="email" label="Email" :dense="dense" type="email"/>
    </div>
   

  </form>
</template>

<style scoped>


.logo{
  width: 500px;
  height: 500px;
  justify-content: center;
  display: flex;
}

.form-container{
  margin: 0;
}

</style>

