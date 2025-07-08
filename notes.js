/*function postWish() {
  const name = document.querySelector('.input-name-box').value;
  const message = document.querySelector('.input-wish-box').value;

  if (!name || !message) return;

  const wishRef = firebase.database().ref('wishes');
  wishRef.push({
    name: name,
    message: message,
    time: new Date().toLocaleString()
  });

  document.querySelector('.input-name-box').value = '';
  document.querySelector('.input-wish-box').value = '';
}

firebase.database().ref('wishes').on('child_added', (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key; // ⬅️ Get unique Firebase ID

  const note = document.createElement('div');
  note.className = 'note';

  note.innerHTML = `
    <strong>${data.name}</strong>
    <p>${data.message}</p>
    <small>${data.time}</small><br>
    <button onclick="deleteWish('${key}')">Delete</button>
  `;

  document.getElementById('notesDisplay').prepend(note);
});

function deleteWish(key) {
  if (confirm("Are you sure you want to delete this wish?")) {
    firebase.database().ref('wishes').child(key).remove();
  }
}
firebase.database().ref('wishes').on('child_removed', (snapshot) => {
  const key = snapshot.key;
  const noteElements = document.querySelectorAll('.note');

  noteElements.forEach((el) => {
    if (el.innerHTML.includes(`deleteWish('${key}')`)) {
      el.remove();
    }
  });
});*/

/*function postWish() {
  const name = document.querySelector('.input-name-box').value;
  const message = document.querySelector('.input-wish-box').value;
  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];

  if (!name || !message) return;

  if (file) {
    const storageRef = firebase.storage().ref('wishImages/' + Date.now() + '_' + file.name);
    storageRef.put(file).then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      saveWish(name, message, downloadURL);
    }).catch(error => {
      console.error('Image upload failed:', error);
    });
  } else {
    saveWish(name, message);
  }

  document.querySelector('.input-name-box').value = '';
  document.querySelector('.input-wish-box').value = '';
  imageInput.value = '';
}

function saveWish(name, message, imageURL = '') {
  const wishRef = firebase.database().ref('wishes');
  wishRef.push({
    name,
    message,
    time: new Date().toLocaleString(),
    imageURL
  });
}

firebase.database().ref('wishes').on('child_added', (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const note = document.createElement('div');
  note.className = 'note';

  note.innerHTML = `
    <strong>${data.name}</strong>
    <p>${data.message}</p>
    <small>${data.time}</small><br>
    ${data.imageURL ? `<img src="${data.imageURL}" style="max-width: 100%; margin-top: 10px; border-radius: 10px;" />` : ''}
    <br><button onclick="deleteWish('${key}')">Delete</button>
  `;

  document.getElementById('notesDisplay').prepend(note);
});

function deleteWish(key) {
  if (confirm("Are you sure you want to delete this wish?")) {
    firebase.database().ref('wishes').child(key).remove();
  }
}

firebase.database().ref('wishes').on('child_removed', (snapshot) => {
  const key = snapshot.key;
  const noteElements = document.querySelectorAll('.note');

  noteElements.forEach((el) => {
    if (el.innerHTML.includes(`deleteWish('${key}')`)) {
      el.remove();
    }
  });
});
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in anonymously ✅");
  })
  .catch((error) => {
    console.error("Anonymous sign-in failed ❌", error);
  });*/

const imgbbApiKey = "da81c6286d7c7e58d62e1f1fd6585f64"; // Replace this with your real key

function postWish() {
  const name = document.querySelector('.input-name-box').value;
  const message = document.querySelector('.input-wish-box').value;
  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];

  if (!name || !message) return;

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64Image = reader.result.split(',')[1];

      fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: new URLSearchParams({
          image: base64Image,
        }),
      })
        .then(res => res.json())
        .then(data => {
          const imageURL = data.data.url;
          saveWish(name, message, imageURL);
        })
        .catch(err => {
          console.error("ImgBB upload failed ❌", err);
          saveWish(name, message); // fallback without image
        });
    };
    reader.readAsDataURL(file);
  } else {
    saveWish(name, message);
  }

  document.querySelector('.input-name-box').value = '';
  document.querySelector('.input-wish-box').value = '';
  imageInput.value = '';
}

function saveWish(name, message, imageURL = '') {
  firebase.database().ref('wishes').push({
    name,
    message,
    time: new Date().toLocaleString(),
    imageURL
  });
}

firebase.database().ref('wishes').on('child_added', (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const note = document.createElement('div');
  note.className = 'note';
  note.innerHTML = `
    <strong>${data.name}</strong>
    <p>${data.message}</p>
    <small>${data.time}</small><br>
    ${data.imageURL ? `<img src="${data.imageURL}" style="max-width: 100%; margin-top: 10px; border-radius: 10px;" />` : ''}
    <br><button onclick="deleteWish('${key}')">Delete</button>
  `;

  document.getElementById('notesDisplay').prepend(note);
});

function deleteWish(key) {
  if (confirm("Are you sure you want to delete this wish?")) {
    firebase.database().ref('wishes').child(key).remove();
  }
}

firebase.database().ref('wishes').on('child_removed', (snapshot) => {
  const key = snapshot.key;
  const noteElements = document.querySelectorAll('.note');
  noteElements.forEach(el => {
    if (el.innerHTML.includes(`deleteWish('${key}')`)) {
      el.remove();
    }
  });
});






