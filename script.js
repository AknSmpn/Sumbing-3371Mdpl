/* ========================
   FADE IN
======================== */
document.addEventListener("DOMContentLoaded", ()=>{
    document.body.classList.add("show");
});

/* ========================
   NAVIGATION (FIX MODULE)
======================== */
window.nextPage = function(){
    document.body.classList.remove("show");
    setTimeout(()=>{
        window.location.href = "menu.html";
    },300);
}

window.goGallery = function(id){
    document.body.classList.remove("show");
    setTimeout(()=>{
        window.location.href = "gallery.html?id=" + id;
    },300);
}

window.goBack = function(){
    document.body.classList.remove("show");
    setTimeout(()=>{
        window.location.href = "menu.html";
    },300);
}

/* ========================
   MENU GENERATE
======================== */
const menuContainer = document.getElementById("menuContainer");

if(menuContainer){

    const namaButton = [
        "Basecamp","Pos 1","Pos 2","Pos 3","Sunset Camp","Pos 4","Puncak"
    ];

    for(let i=1;i<=7;i++){
        let btn = document.createElement("button");
        btn.innerText = namaButton[i-1];
        btn.className = "menu-btn";
        btn.style.animationDelay = (i * 0.1) + "s";

        btn.onclick = ()=>goGallery(i);

        menuContainer.appendChild(btn);
    }
}

/* ========================
   GALLERY (SUPABASE VERSION)
======================== */
const gallery = document.getElementById("gallery");

if (gallery) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    loadGallery(id);
}

/* ========================
   LOAD GALLERY
======================== */
function loadGallery(id){
    gallery.innerHTML = "";

    // langsung tampilkan upload box
    createUploadBox();
}

/* ========================
   UPLOAD BOX (SUPABASE)
======================== */
function createUploadBox(){
    let box = document.createElement("div");
    box.className = "img-placeholder";
    box.innerText = "Add Image";

    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    box.onclick = ()=>input.click();

    input.onchange = async function(e){
        const file = e.target.files[0];
        if(!file) return;

        const fileName = Date.now() + "-" + file.name;

        const { data, error } = await supabaseClient
            .storage
            .from("sumbing")
            .upload(fileName, file);

        if(error){
            alert("Upload gagal!");
            console.log(error);
            return;
        }

        const { data: urlData } = supabaseClient
            .storage
            .from("sumbing")
            .getPublicUrl(fileName);

        addImageToGallery(urlData.publicUrl);
    };

    gallery.appendChild(box);
    gallery.appendChild(input);
}

/* ========================
   ADD IMAGE TO GALLERY
======================== */
function addImageToGallery(url){
    let img = document.createElement("img");
    img.src = url;
    img.onclick = ()=>showPopup(url);

    gallery.insertBefore(img, gallery.firstChild);
}

/* ========================
   POPUP
======================== */
function showPopup(src){
    const popup = document.getElementById("popup");
    popup.style.display = "flex";
    document.getElementById("popupImg").src = src;
}

function closePopup(){
    document.getElementById("popup").style.display = "none";
}