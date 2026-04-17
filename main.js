document.addEventListener("DOMContentLoaded", ()=>{
    document.body.classList.add("show");
});

/* NAVIGATION */
window.nextPage = function(){
    window.location.href = "pilih.html";
}

window.pilihArah = function(arah){
    window.location.href = "menu.html?arah=" + arah;
}

/* FIXED: goGallery hanya 1 versi */
window.goGallery = function(id){
    const params = new URLSearchParams(window.location.search);
    const arah = params.get("arah") || "naik";

    window.location.href = "gallery.html?id=" + id + "&arah=" + arah;
}

window.goBackPilih = function(){
    window.location.href = "index.html";
}

window.goBackHome = function(){
    document.body.classList.remove("show");
    setTimeout(()=>{
        window.location.href = "index.html";
    },300);
}

window.goBackMenu = function(){
    window.location.href = "pilih.html";
}

/* MENU BUTTON */
const menuContainer = document.getElementById("menuContainer");

if(menuContainer){
    const namaButton = [
        "Basecamp","Pos 1","Pos 2","Pos 3","Sunset Camp","Pos 4","Puncak"
    ];

    for(let i=1;i<=7;i++){
        let btn = document.createElement("button");
        btn.innerText = namaButton[i-1];
        btn.className = "menu-btn";

        btn.onclick = ()=>goGallery(i);

        menuContainer.appendChild(btn);
    }
}