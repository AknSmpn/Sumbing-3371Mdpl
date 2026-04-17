document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init(){

    const gallery = document.getElementById("gallery");

    if(!gallery){
        console.error("Gallery tidak ditemukan");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "default";
    const arah = params.get("arah") || "naik";

    const folder = arah + "/" + id;

    loadImages(folder);

    /* ========================
       DRAG & DROP MULTI UPLOAD
    ======================== */
    gallery.addEventListener("dragover", (e) => {
        e.preventDefault();
        gallery.style.background = "rgba(59,130,246,0.1)";
    });

    gallery.addEventListener("dragleave", () => {
        gallery.style.background = "transparent";
    });

    gallery.addEventListener("drop", async (e) => {
        e.preventDefault();
        gallery.style.background = "transparent";

        const files = Array.from(e.dataTransfer.files);
        if(!files.length) return;

        for(const file of files){
            await uploadFile(file, folder);
        }

        loadImages(folder);
    });

    /* ========================
       LOAD IMAGES
    ======================== */
    async function loadImages(folder){
        gallery.innerHTML = "";

        try {
            const { data, error } = await supabaseClient
                .storage
                .from("sumbing")
                .list(folder);

            if(error){
                console.warn("LIST ERROR:", error);
            }

            if(data){
                data.forEach(file => {
                    if(!file.name) return;

                    const { data: urlData } = supabaseClient
                        .storage
                        .from("sumbing")
                        .getPublicUrl(folder + "/" + file.name);

                    const img = document.createElement("img");
                    img.src = urlData.publicUrl;
                    img.onclick = () => showPopup(urlData.publicUrl);

                    gallery.appendChild(img);
                });
            }

        } catch (err) {
            console.warn("ERROR:", err);
        }

        createUploadBox(folder);
    }

    /* ========================
       UPLOAD (MULTI SUPPORT)
    ======================== */
    async function uploadFile(file, folder){

        const fileName = Date.now() + "-" + file.name;

        const { data, error } = await supabaseClient.storage
            .from("sumbing")
            .upload(folder + "/" + fileName, file);

        console.log("UPLOAD:", data, error);

        if(error){
            alert("Upload gagal: " + error.message);
            return;
        }
    }

    /* ========================
       UPLOAD BOX
    ======================== */
    function createUploadBox(folder){

        const box = document.createElement("div");
        box.className = "img-placeholder";
        box.innerText = "add image";

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true; // 🔥 MULTI SELECT
        input.style.display = "none";

        box.onclick = () => input.click();

        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if(!files.length) return;

            for(const file of files){
                await uploadFile(file, folder);
            }

            alert("Upload berhasil!");
            loadImages(folder);
        };

        gallery.appendChild(box);
        gallery.appendChild(input);
    }

    /* ========================
       POPUP
    ======================== */
    window.showPopup = function(src){
        document.getElementById("popup").style.display = "flex";
        document.getElementById("popupImg").src = src;
    }

    window.closePopup = function(){
        document.getElementById("popup").style.display = "none";
    }
}

/* ========================
   BACK
======================== */
function goBack(){
    window.location.href = "menu.html";
}