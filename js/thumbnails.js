/* ============================================================
   THUMBNAILS — Auto-generate video thumbnails from first frame
   
   On page load, for each video card that has a data-video-src
   attribute, we seek a hidden <video> element to the desired
   timestamp and draw it onto a <canvas> to extract the frame.
   The result is injected as a background-image on .video-thumb.

   Usage in HTML:
     <div class="video-thumb" data-video-src="assets/videos/demo.mp4" data-seek="1">
   
   data-seek: seconds into the video to grab (default: 1)
   ============================================================ */

(function () {
  "use strict";

  /**
   * Captures a single frame from a video source at a given time.
   * @param {string} src    - path to the MP4 file
   * @param {number} seekTo - seconds to seek before capture
   * @returns {Promise<string>} - resolves to a data URL (PNG)
   */
  function captureFrame(src, seekTo) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.crossOrigin = "anonymous";

      video.addEventListener("loadedmetadata", () => {
        /* clamp seek time to video duration */
        video.currentTime = Math.min(seekTo, video.duration - 0.1);
      });

      video.addEventListener("seeked", () => {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } catch (e) {
          /* CORS or codec issue — resolve empty so we degrade gracefully */
          resolve(null);
        } finally {
          video.src = "";
          video.load();
        }
      });

      video.addEventListener("error", () => resolve(null));

      video.src = src;
      video.load();
    });
  }

  /**
   * Finds all .video-thumb elements with data-video-src and
   * injects a captured frame as a background image.
   */
  async function generateThumbnails() {
    const thumbs = document.querySelectorAll(".video-thumb[data-video-src]");

    for (const thumb of thumbs) {
      const src = thumb.dataset.videoSrc;
      const seekTo = parseFloat(thumb.dataset.seek ?? "1");

      if (!src) continue;

      const dataUrl = await captureFrame(src, seekTo);

      if (dataUrl) {
        /* Layer the frame under the existing grid/glow overlays */
        thumb.style.backgroundImage = `url('${dataUrl}')`;
        thumb.style.backgroundSize = "cover";
        thumb.style.backgroundPosition = "center";
        /* keep the dark grid overlay readable */
        thumb.classList.add("has-thumbnail");
      }
    }
  }

  /* Run after DOM and initial layout are ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", generateThumbnails);
  } else {
    generateThumbnails();
  }
})();
