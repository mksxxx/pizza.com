<script setup>
import { ref } from 'vue'
import { auth } from '../../firebase/firebase.js'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import logo from '../../assets/pizza.com.png'

defineOptions({
    name: 'LoginPage' // nome multi-word
})

const router = useRouter()
const email = ref('')
const password = ref('')

//login function



async function Login(event) {
    event.preventDefault();
    try {
        const credentialUsers = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = credentialUsers.user
        alert(`Olá ${user.email}, login realizado com sucesso!`)
        router.push('/dashboard')
    } catch (error) {
        alert('Usuario invalido: ' + error.message)
    }
}

async function ResetPassword() {
    // 1. Verifica se o campo de e-mail está preenchido
    if (!email.value) {
        alert('Por favor, digite seu e-mail para receber as instruções de recuperação.');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email.value);

        alert(`Um e-mail de recuperação de senha foi enviado para ${email.value}. Verifique sua caixa de entrada.`);
    } catch (error) {
        console.error("Erro ao enviar e-mail de recuperação:", error.message);

        let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Não há usuário registrado com este e-mail.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'O e-mail digitado é inválido.';
        }
        alert('Erro: ' + errorMessage);
    }
}
</script>

<template>
    <div class="page-container">
        <form @submit="Login" class="login-form">
            <img :src="logo" alt="logo" class="logo">
            <p>Digite suas credenciais para realizar o login</p>
            <div class="form-group">
                <div class="input-container">
                    <q-input v-model="email" label="Digite seu email" type="email" class="input" autofocus />
                </div>
            </div>

            <div class="form-group">
                <div class="input-container">
                    <q-input v-model="password" label="Digite sua senha" type="password" class="input" />
                </div>
            </div>
            <a href="#" class="forgot-password-link" @click.prevent="ResetPassword">Esqueci minha senha</a>

            <q-btn class="b btncustom" type="submit" label="Entrar" />

        </form>
    </div>

</template>



<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

:root {
    --background: #f8f8f8;
    --background-login: #fff;
    --text-color: #333;
    --label-color: #777;
    --button-color: #1807b0;
}

.page-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

body {
    font-family: "Poppins", sans-serif;
    background-color: var(--background);
    display: flex;
    align-items: center;
}

.login-form {
    background-color: var(--background-login);
    padding: 40px 50px;
    border-radius: 10px;
    box-shadow: 0 0 10px #00532e;
    width: 350px;
    text-align: center;
    --q-color-primary: #00532e;
}

.logo {
    width: 200px;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 0px;
}

p {
    color: #474a49;
    margin-bottom: 10px;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
}

.input-container {
    position: relative;
    flex: 1;
}

.input.q-field--standard .q-field__control::after {
  background: #00532e !important;  /* Cor do input dps de perder o foco*/
}

.input.q-field--focused .q-field__control::after {
  background: #00532e !important; /* Cor do input qnd ganha o foco*/
}


.input.q-field--float .q-field__label {
    color: #00532e !important; /*Cor do texto do label*/
}

.input .q-field__native {
    color: #2b2a2a; /*Cor do texto q o input vai receber*/
}

.btncustom {
    width: 100%;
    background-color: #00532e;
    color: white;
    border: none;
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.5s ease;
}

.forgot-password-link {
    display: block;
    text-align: right;
    margin-top: -15px;
    margin-bottom: 20px;
    font-size: 0.9em;
    color: #1976D2;
    text-decoration: none;
}

.forgot-password-link:hover {
    text-decoration: underline;
}


</style>