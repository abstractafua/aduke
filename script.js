// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDOiQttUT8y46vyhi8LwNLPP66of-2_t8",
  authDomain: "aduke-4d375.firebaseapp.com",
  projectId: "aduke-4d375",
  storageBucket: "aduke-4d375.firebasestorage.app",
  messagingSenderId: "615042426738",
  appId: "1:615042426738:web:7248b5a6f517037b3e5feb",
  measurementId: "G-PHELM40SFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to submit comment to Firestore
function submitComment() {
  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;

  if (name && comment) {
    addDoc(collection(db, "comments"), {
      name: name,
      comment: comment,
      timestamp: new Date()
    })
    .then(() => {
      displayComments(); // Reload comments after submitting
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
}

// Function to display comments
function displayComments() {
  const commentsSection = document.getElementById('comments-section');
  commentsSection.innerHTML = ''; // Clear existing comments

  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp.toDate(); // Convert Firestore Timestamp to JS Date
        const formattedTime = formatDate(timestamp); 
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `<strong>${data.name}</strong> <span class="timestamp">(${formattedTime})</span>: <p>${data.comment}</p>`;
        commentsSection.appendChild(commentDiv);
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

// Function to format the timestamp into a readable format (e.g., "YYYY-MM-DD HH:MM:SS")
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

// Load comments on page load
window.onload = displayComments;

// Expose the submitComment function globally by attaching it to the window object
window.submitComment = submitComment;
