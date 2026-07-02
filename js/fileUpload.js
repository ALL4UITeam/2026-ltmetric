let dropArea = document.getElementById('drop-area');
let fileList = document.getElementById('file-list');
let fileCount = document.querySelector('.state-count');

let uploadedFiles = [];

let totalFileSize = 0; // 파일 크기의 총합 (바이트 단위)

const MAX_FILES = 3;
const MAX_SIZE = 9 * 1024 * 1024; // 9MB를 바이트로 변환


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});


dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.style.borderColor = 'black';
}

function unhighlight(e) {
    dropArea.style.borderColor = '#ccc';
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    let newTotalFileSize = totalFileSize;

    for (let i = 0; i < files.length; i++) {
        newTotalFileSize += files[i].size;
        if (uploadedFiles.length >= MAX_FILES || newTotalFileSize > MAX_SIZE) {
            alert('총 3개의 파일과 총 9MB를 초과할 수 없습니다.');
            return;
        }
    }

    [...files].forEach(file => {
        uploadedFiles.push(file);
        addFileToList(file);
    });

    totalFileSize = newTotalFileSize;
    updateFileCount();
    updateFileSize();
}

function addFileToList(file) {
    let fileItem = document.createElement('div');
    fileItem.className = 'files__item';
    fileItem.innerHTML = `
        <span class="files__info"><i class="material-symbols-outlined">text_snippet</i><span>${file.name} [${file.type}, ${Math.round(file.size / 1024)}KB]</span></span>
        <button type="button" class="files__del" onclick="removeFile('${file.name}')"><i class="icon icon-del"></i>삭제</button>
    `;
    fileList.appendChild(fileItem);
}

function removeFile(fileName) {
    const fileToRemove = uploadedFiles.find(file => file.name === fileName);
    if (fileToRemove) {
        totalFileSize -= fileToRemove.size;
    }
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFileList();
    updateFileCount();
    updateFileSize();
}

function updateFileList() {
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => addFileToList(file));
    
}
function updateFileCount() {
    
    fileCount.innerText = `${uploadedFiles.length}개`;
}

function uploadFile(file) {
    let url = 'url';
    let formData = new FormData();
    formData.append('file', file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(() => { /* 완료 */ })
    .catch(() => { /* 에러 */ })
}