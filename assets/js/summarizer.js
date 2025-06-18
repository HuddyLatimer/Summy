// Summarize text function
async function summarizeText(text) {
    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getApiKey()
        },
        body: JSON.stringify({
            prompt: `Summarize the following text:\n\n${text}`,
            max_tokens: 150,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.choices[0].text.trim();
}

// UI helper functions
function showLoading(show) {
    document.getElementById('loadingIndicator').classList.toggle('active', show);
    document.getElementById('summarizeBtn').disabled = show;
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    setTimeout(() => errorMessage.classList.remove('active'), 5000);
}

function showSummary(summary) {
    const summaryText = document.getElementById('summaryText');
    const summaryResult = document.getElementById('summaryResult');
    summaryText.textContent = summary;
    summaryResult.style.display = 'block';
}

function loadSummary(data) {
    document.getElementById('input').value = data.originalText;
    showSummary(data.summary);
}

// File handling
async function readFile(file) {
    if (file.type === 'text/plain') {
        return await file.text();
    } else {
        throw new Error('Only text files are supported at the moment');
    }
}

// Copy and Download functionality
function setupActions() {
    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('summaryText').textContent);
        showToast('Summary copied to clipboard');
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
        const blob = new Blob([document.getElementById('summaryText').textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Summary downloaded');
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// File drag and drop setup
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const input = document.getElementById('input');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            try {
                const text = await readFile(file);
                input.value = text;
            } catch (error) {
                showError(error.message);
            }
        }
    });

    dropZone.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.doc,.docx,.pdf';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await readFile(file);
                    input.value = text;
                } catch (error) {
                    showError(error.message);
                }
            }
        };
        fileInput.click();
    });
}

// Initialize summarizer functionality
function initSummarizer() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const input = document.getElementById('input');

    summarizeBtn.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) {
            showError('Please enter some text to summarize');
            return;
        }

        try {
            showLoading(true);
            const summary = await summarizeText(text);
            showSummary(summary);
            await saveSummary(text, summary);
            await loadHistory(auth.currentUser.uid);
        } catch (error) {
            showError(error.message);
        } finally {
            showLoading(false);
        }
    });

    setupActions();
    setupDragAndDrop();
} 