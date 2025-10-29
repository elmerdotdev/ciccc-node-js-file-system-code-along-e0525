const fileForm = document.getElementById('file-form')
const filesList = document.querySelector('.files-list')
const fileContent = document.querySelector('.file-content')

const BACKEND_URL = 'http://localhost:3500'

// Get files
const fetchFiles = async() => {
  const res = await fetch(`${BACKEND_URL}/list`)
  const data = await res.json()
  return data
}

// Read a file
const readFile = async(filename) => {
  const res = await fetch(`${BACKEND_URL}/read?filename=${filename}`)
  const data = await res.json()
  fileContent.textContent = data
}

// Add a file
const addFile = async(filename, fileContent) => {
  const res = await fetch(`${BACKEND_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename,
      fileContent
    })
  })
  const data = await res.json()
  console.log(data)
  build() // Rebuild list
}

// Delete file
const deleteFile = async(filename) => {
  const response = confirm("Are you sure you want to delete?")
  if (response) {
    const res = await fetch(`${BACKEND_URL}/delete?filename=${filename}`, {
      method: "DELETE"
    })
    const data = await res.json()
    console.log(data)
    build() // Rebuild list
  }
}

// Form submit
fileForm.addEventListener('submit', async(e) => {
  e.preventDefault()
  const fileNameInput = fileForm.querySelector('#filename').value
  const fileContentInput = fileForm.querySelector('#content').value
  await addFile(fileNameInput, fileContentInput)
  fileForm.reset()
})

// Build list
const build = async () => {
  filesList.innerHTML = ""
  fileContent.textContent = ""
  const files = await fetchFiles()

  files.forEach(file => {
    const li = document.createElement('li')
    li.classList.add("d-flex", "justify-content-between", "align-items-center", "list-group-item")
    
    const span = document.createElement('span')
    span.textContent = file
    span.style.cursor = "pointer"
    span.addEventListener('click', () => readFile(file))

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("btn", "btn-danger")
    deleteBtn.addEventListener('click', () => deleteFile(file))

    li.appendChild(span)
    li.appendChild(deleteBtn)
    filesList.appendChild(li)
  })
}

// Initialize
build()