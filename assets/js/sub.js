window.addEventListener("load", () => {
  setTimeout(() => {
    const target = document.querySelector(".intro--depth");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
        // 요소의 시작 부분이 화면 맨 위에 오도록
      });
    }
  }, 2e3);
});
if (document.querySelector(".page_title")) {
  const pageMainTitle = document.querySelector(".page_title");
  const pageSubDesc = document.querySelector(".sub_title_desc");
  const text = pageMainTitle.textContent.trim();
  pageMainTitle.textContent = "";
  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.transform = "translateY(100%)";
    pageMainTitle.appendChild(span);
  });
  gsap.to(".page_title span", {
    y: 0,
    duration: 1,
    stagger: 0.09,
    ease: "power3.out",
    onComplete: () => {
      gsap.fromTo(
        pageSubDesc,
        { y: 0, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", filter: "blur(0px)" }
      );
    }
  });
  gsap.fromTo(
    ".intro--banner-background",
    { clipPath: "circle(0% at 50% 50%)" },
    { clipPath: "circle(100% at 50% 50%)", duration: 1.3, ease: "power3.out" }
  );
}
