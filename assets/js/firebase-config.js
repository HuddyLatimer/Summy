// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRDrBKIQe3vhFVHDYUQ2341-YsdJlxZI4",
    authDomain: "summy-ai.firebaseapp.com",
    projectId: "summy-ai",
    storageBucket: "summy-ai.appspot.com",
    messagingSenderId: "1015243371597",
    appId: "1:1015243371597:web:d7f8f8f9f8f8f8f8f8f8f8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = '/';
    } else {
        loadUserData(user);
        loadHistory(user.uid);
    }
});

// Load user data
async function loadUserData(user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        document.getElementById('userAvatar').src = userData.photoURL || 'assets/icons/default-avatar.svg';
    }
}

// Load history
async function loadHistory(userId) {
    const historyList = document.getElementById('historyList');
    const historySnapshot = await db.collection('summaries')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

    historyList.innerHTML = '';
    historySnapshot.forEach(doc => {
        const data = doc.data();
        const date = new Date(data.timestamp.seconds * 1000);
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
            <div class="history-preview">${data.summary}</div>
        `;
        historyItem.onclick = () => loadSummary(data);
        historyList.appendChild(historyItem);
    });
}

// Save summary to Firestore
async function saveSummary(originalText, summary) {
    await db.collection('summaries').add({
        userId: auth.currentUser.uid,
        originalText,
        summary,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Get API key from Firestore
async function getApiKey() {
    const apiKeyDoc = await db.collection('api_keys').doc('openai').get();
    return apiKeyDoc.data().key;
}

// Logout functionality
function handleLogout() {
    auth.signOut().then(() => {
        window.location.href = '/';
    });
} 