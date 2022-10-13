/*global fetch*/

const client_id = "ZbWzDR6sk0qW2gbkBj2KUT2WfFf";
const client_secret = "QzuRV3Z9WWKRFKaqb5hCwPcEW96VmVquwcMI6BZEhX3t/av1YgMD9BNBFZmGbwRI58yMOXOgbvZ4IJQqOT3Y1A==";
const auth = {
    clientId: client_id,
    clientSecret: client_secret
};

loadProfileImage();

document.getElementById("changeProfile").addEventListener("click", function(e) {
    document.getElementById("profileUploader").click();
});

document.getElementById("profileUploader").addEventListener("change", function(e) {
    e.preventDefault();
    storeFile(this.files[0]);
});

async function storeFile(file) {
    let filename = `profile${Date.now()}${file.name.substring(file.name.lastIndexOf("."))}`;
    let token = await getToken();

    let files = await fetch("https://api.sirv.com/v2/files/readdir?dirname=/profile", {
        headers: {
            "authorization": `Bearer ${token}`
        }
    });

    let json = await files.json();
    let foundFile = json.contents.find(item => item.filename.startsWith("profile"));

    if (foundFile) {
        await fetch(`https://api.sirv.com/v2/files/delete?filename=/profile/${foundFile.filename}`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
    }

    let result = await fetch(`https://api.sirv.com/v2/files/upload?filename=/profile/${filename}`, {
        method: "POST",
        body: file,
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": file.type
        }
    });

    if (!result.ok) {
        alert("There was a problem while changing your profile photo.");
    }
    else {
        loadProfileImage();
    }
}

async function loadProfileImage() {
    document.getElementById("profile").src = "";
    let token = await getToken();

    let files = await fetch("https://api.sirv.com/v2/files/readdir?dirname=/profile", {
        headers: {
            "authorization": `Bearer ${token}`
        }
    });

    let json = await files.json();
    let foundFile = json.contents.find(item => item.filename.startsWith("profile"));

    if (foundFile) {
        document.getElementById("profile").src = `https://eshazapp.sirv.com/profile/${foundFile.filename}`;
    }
}

async function getToken() {
    let result = await fetch("https://api.sirv.com/v2/token", {
        method: "POST",
        body: JSON.stringify(auth),
        headers: {
            "content-type": "application/json"
        }
    });
    let json = await result.json();
    return json.token;
}
