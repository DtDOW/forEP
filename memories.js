const bubbles = [];
const bubbleSize = 120;
const topPadding = 100; // header height

function createBubbleWithMemory(memory) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  document.body.appendChild(bubble);

  const state = {
    el: bubble,
    x: Math.random() * (window.innerWidth - bubbleSize),
    y: topPadding + Math.random() * (window.innerHeight - topPadding - bubbleSize),
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    clicked: false,
    memory: memory
  };

  bubbles.push(state);

  bubble.onclick = () => {
    if (!state.clicked) {
      state.clicked = true;
      bubble.classList.add('opened');
    }
    showPopupWithMemory(state.memory);
  };
}

function animate() {
  bubbles.forEach(b => {
    if (!b.clicked) {
      b.x += b.dx * 2;
      b.y += b.dy * 2;

      if (b.x <= 0 || b.x >= window.innerWidth - bubbleSize) b.dx *= -1;
      if (b.y <= topPadding || b.y >= window.innerHeight - bubbleSize) b.dy *= -1;

      b.el.style.left = b.x + 'px';
      b.el.style.top = b.y + 'px';
    }
  });

  requestAnimationFrame(animate);
}

let currentMemoryKey = null;

function showPopupWithMemory(memory) {
  document.getElementById('popupOverlay').style.display = 'block';
  document.getElementById('popup').style.display = 'block';
  document.querySelector('.upload-memory-container').style.display = 'none';  // 👈 HIDE form

  document.querySelector('#popup h2').textContent = memory.title || "Untitled";

  const collageContainer = document.getElementById('collageContainer');
  collageContainer.innerHTML = "";

  memory.images.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.className = "collage-img";
    collageContainer.appendChild(img);
  });

  if (memory.note) {
    const noteWrapper = document.createElement('div');
    noteWrapper.className = "memory-note";
    noteWrapper.textContent = memory.note;
    collageContainer.appendChild(noteWrapper);
  }

  currentMemoryKey = memory.key;
}


function deleteCurrentMemory() {
  if (!currentMemoryKey) return;

  firebase.database().ref("memories").child(currentMemoryKey).remove();

  const index = bubbles.findIndex(b => b.memory.key === currentMemoryKey);
  if (index !== -1) {
    document.body.removeChild(bubbles[index].el);
    bubbles.splice(index, 1);
  }

  currentMemoryKey = null;
  closePopup();
}

function closePopup() {
  document.getElementById('popupOverlay').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
  document.querySelector('.upload-memory-container').style.display = 'flex';  // 👈 SHOW again
}


const memoryInput = document.getElementById("memoryImageInput");
memoryInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;
});

const imgbbApiKey = "da81c6286d7c7e58d62e1f1fd6585f64";

async function uploadMemory() {
  const files = document.getElementById('memoryImageInput').files;
  const title = document.getElementById('memoryTitleInput').value;
  const note = document.getElementById('memoryNoteInput').value;

  if (!files.length || !note) {
    alert("Please select at least one image and write a note.");
    return;
  }

  document.getElementById("uploadProgressBar").style.display = "block";
  document.getElementById("uploadBar").style.width = "0%";

  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await fileToBase64(file);
    const formData = new URLSearchParams();
    formData.append("image", base64);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        urls.push(data.data.url);
      }

      const progress = ((i + 1) / files.length) * 100;
      document.getElementById("uploadBar").style.width = progress + "%";

    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const memoryRef = firebase.database().ref("memories");
  const newMemory = {
    id: Date.now(),
    title: title || "Untitled",
    note,
    images: urls,
    time: new Date().toLocaleString()
  };

  memoryRef.push(newMemory);

  alert("Memory uploaded!");
  document.getElementById('memoryTitleInput').value = '';
  document.getElementById('memoryNoteInput').value = '';
  document.getElementById('memoryImageInput').value = '';
  document.getElementById("uploadProgressBar").style.display = "none";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let animationStarted = false;
firebase.database().ref("memories").on("child_added", (snapshot) => {
  const memory = snapshot.val();
  memory.key = snapshot.key;
  createBubbleWithMemory(memory);

  if (!animationStarted) {
    animate();
    animationStarted = true;
  }
});

document.getElementById('popupOverlay').addEventListener('click', closePopup);




