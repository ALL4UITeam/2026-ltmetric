
const isSolution = document.querySelector('[data-current="business"]') ? true : false;


if(!isSolution){

} else {
    const bar = document.querySelector('.bar');
    document.addEventListener("DOMContentLoaded", function() {
        const insertBar = document.querySelector(".breadcrumb");
        const contents = document.getElementById("contents");

        const progressBar = document.createElement("div");
        progressBar.classList.add("bar");
        insertBar.appendChild(progressBar);
        
        
        function updateProgressBar() {
            const contentHeight = contents.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
        
            const scrollPercent = (scrollY / (contentHeight - windowHeight)) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + "%";
        }
        
        function onResize() {
            updateProgressBar();
        }
        window.addEventListener("scroll", updateProgressBar);
        window.addEventListener("resize", onResize);
        
        // Initial update
        updateProgressBar();
    });
}

