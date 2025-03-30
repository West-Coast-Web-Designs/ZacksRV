const fileUploadButton = document.getElementById("file-upload");

if (fileUploadButton) {
    fileUploadButton.addEventListener("change", function (event) {
        const fileInputHelpText = document.getElementById(
            "file-input-help-text",
        );
        const file = event.target.files[0];
        if (file) {
            fileInputHelpText.innerHTML = file.name;
        } else {
            fileInputHelpText.innerHTML = "Choose a file (Max 15MB)";
        }
    });
}
