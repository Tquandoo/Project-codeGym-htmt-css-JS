let showPassword = document.getElementById('login__group-showicon');
let inputPassword= document.getElementById('password');
showPassword.onclick = function(){
    if(inputPassword.type == 'password'){
        inputPassword.type = 'text';
        showPassword.classList.add('show');
    }else{
        inputPassword.type = 'password';
        showPassword.classList.remove('show');
    }
}
function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(password == "24012003"){
        window.localStorage.setItem("user", username);
        window.location.href = "trangchu.html";
    }else{
        alert("Sai thong tin dang nhap!");
    }
}
function showLogin() {
    let loginContainer = document.getElementById('loginContainer');
    loginContainer.style.display = "block";
    window.addEventListener("click", function(event) {
        if (event.target === loginContainer) {
            loginContainer.style.display = "none";
        }
    });
}
