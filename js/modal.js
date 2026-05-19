/* ============================================================
   MODAL — Local MP4 video playback
   Open · Close · Keyboard & Backdrop handlers
   ============================================================ */

/**
 * Video source map.
 * All values point to local MP4 files.
 * To add per-video sources later, just replace the path.
 */
const videoLinks = {
  featured: "assets/videos/demo.mp4",
  v1: "assets/videos/demo.mp4",
  v2: "assets/videos/demo.mp4",
  v3: "assets/videos/demo.mp4",
};

/**
 * Opens the modal and injects an HTML5 <video> element.
 * Video autoplays, muted by default, with controls visible.
 * @param {string} id    - Key from videoLinks
 * @param {string} title - Human-readable title shown in the header
 */
function openModal(id, title) {
  const src = videoLinks[id];
  const overlay = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  const heading = document.getElementById("modal-title");

  heading.textContent = title;

  if (src) {
    body.innerHTML = `
      <video
        class="modal-video"
        autoplay
        muted
        controls
        playsinline
        preload="metadata"
      >
        <source src="${src}" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>`;
  } else {
    body.innerHTML = `
      <div class="modal-placeholder">
        <p>Video not yet available.</p>
        <a href="https://tinyurl.com/mipp-team6" target="_blank">
          View on GitHub
        </a>
      </div>`;
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the modal.
 * Pauses and removes the video element to avoid memory leaks
 * and ensure playback stops immediately.
 */
function closeModalDirect() {
  const overlay = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  /* Pause before removing so browser releases the media resource */
  const video = body.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  overlay.classList.remove("open");
  body.innerHTML = "";
  document.body.style.overflow = "";
}

/**
 * Closes when clicking the dark backdrop (not the modal box itself).
 * @param {MouseEvent} e
 */
function closeModal(e) {
  if (e.target.id === "modal") closeModalDirect();
}

/* Keyboard: Escape closes modal */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalDirect();
});
