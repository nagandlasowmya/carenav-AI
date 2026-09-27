function loginUser() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");

    if (username === "" || password === "") {

        message.innerText = "Please enter your name and password.";
        message.style.color = "red";

        return;
    }

    localStorage.setItem("careNavUser", username);

    message.innerText = "Login successful!";
    message.style.color = "green";

    setTimeout(function () {

        window.location.href = "index.html";

    }, 800);
}