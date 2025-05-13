const video = document.getElementById("video");
const previewImg = document.getElementById("preview-img");
const retryBtn = document.getElementById("retry-btn");
const confirmBtn = document.getElementById("confirm-btn");

const camModalEl = document.getElementById("cameraPermissionModal");
const locModalEl = document.getElementById("locationPermissionModal");
const allowCamBtn = document.getElementById("allowCameraBtn");
const allowLocBtn = document.getElementById("allowLocationBtn");

const camModal = new bootstrap.Modal(camModalEl);
const locModal = new bootstrap.Modal(locModalEl);

let stream;

function awaitPermission(modalInstance, allowButton) {
  return new Promise((resolve) => {
    modalInstance.show();
    const handler = () => {
      allowButton.removeEventListener("click", handler);
      modalInstance.hide();
      resolve(true);
    };
    allowButton.addEventListener("click", handler);
  });
}

async function pedirPermissoes() {
  await awaitPermission(camModal, allowCamBtn);
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (err) {
    console.error("Permissão de câmera negada", err);
    return false;
  }

  await awaitPermission(locModal, allowLocBtn);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Localização obtida:", pos.coords);
        resolve(true);
      },
      (err) => {
        console.error("Permissão de localização negada", err);
        resolve(false);
      }
    );
  });
}

async function startCamera() {
  const ok = await pedirPermissoes();
  if (!ok) {
    previewImg.style.display = "block";
    video.style.display = "none";
    return;
  }

  previewImg.style.display = "none";
  video.style.display = "block";
  video.srcObject = stream;
}

function captureImage() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL("image/png");

  stream.getTracks().forEach((t) => t.stop());
  video.srcObject = null;
  video.style.display = "none";

  previewImg.src = dataUrl;
  previewImg.style.display = "block";
}

window.addEventListener("DOMContentLoaded", startCamera);
retryBtn.addEventListener("click", startCamera);
confirmBtn.addEventListener("click", captureImage);
