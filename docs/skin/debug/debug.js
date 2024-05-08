

function toggle_tags() {
    document.body.classList.toggle("tags");
}
toggle_tags();
document.getElementById("btn_tags").addEventListener("click", toggle_tags);