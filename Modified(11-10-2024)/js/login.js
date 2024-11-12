let user = document.getElementById("email");
let pass = document.getElementById("pass");
let login = document.getElementById("login");
let userIsLogin = sessionStorage.getItem("user");

let data = [
    {
        "username" : "Kent",
        "password" : "123"
    },
    {
        "username" : "Kentoy",
        "password" : "123"
    },
    {
        "username" : "Ruisu",
        "password" : "123"
    }   
];


login.addEventListener("click", function() {
    if (checkLogin(user.value, pass.value)) {
        // Set session storage for logged-in user
        sessionStorage.setItem("user", user.value);
        window.location = "../html/salesRecord.html";
    } else {
        alert("Invalid Credentials!!");
    }
});

function checkLogin(username, password) {
    return data.some(user => user.username === username && user.password === password);
}
