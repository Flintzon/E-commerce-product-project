// Logika Panel Sliding
        const signUpBtn = document.getElementById("signUpBtn");
        const signInBtn = document.getElementById("signInBtn");
        const authShell = document.getElementById("authShell");

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4SH5lcmZ6gzJqCT20IWWBVHdmPq9jYMfrZp--hOsw_HDSghBdKS3TYfAKCXcEh37O/exec";

        signUpBtn.addEventListener("click", () => {
        authShell.classList.add("right-panel-active");
        });

        signInBtn.addEventListener("click", () => {
        authShell.classList.remove("right-panel-active");
        });

        async function handleSignUp(event) {
        event.preventDefault();

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document
            .getElementById("signup-password")
            .value.trim();

        try {
            const res = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "signup",
                name,
                email,
                password,
            }),
            });

            const data = await res.json();

            if (!data.ok) {
            alert(data.message);
            return;
            }

            localStorage.setItem("lb_user", JSON.stringify(data.user));
            alert("Akun berhasil dibuat. Silakan masuk.");
            authShell.classList.remove("right-panel-active");
            document.getElementById("signin-email").value = email;
            document.getElementById("signin-password").value = "";
        } catch (err) {
            console.error(err);
            alert("Gagal menghubungkan ke Google Sheets.");
        }
        }

        async function handleSignIn(event) {
        event.preventDefault();

        const email = document.getElementById("signin-email").value.trim();
        const password = document
            .getElementById("signin-password")
            .value.trim();

        try {
            const url = `${SCRIPT_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data.ok) {
            alert(data.message);
            return;
            }

            localStorage.setItem("lb_user", JSON.stringify(data.user));
            alert(`Login berhasil. Selamat datang, ${data.user.name}!`);
            window.location.href = "index.html";
        } catch (err) {
            console.error(err);
            alert("Gagal menghubungkan ke Google Sheets.");
        }
    }