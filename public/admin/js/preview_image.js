// alert('hello i am ready to wrk')

function PreviewImage() {
    // alert(id)
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById('project_image').files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("preview").src = oFREvent.target.result;
    };
};

document.getElementById('project_image').addEventListener('change', PreviewImage)