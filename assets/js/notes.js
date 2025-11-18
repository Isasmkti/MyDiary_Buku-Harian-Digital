// Notes functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load notes from localStorage
    let notesData = JSON.parse(localStorage.getItem('notes_data') || '[]');
    
    // DOM elements
    const notesContainer = document.getElementById('notes-container');
    const noteModal = document.getElementById('note-modal');
    const addNoteBtn = document.getElementById('add-note-btn');
    const closeModal = document.getElementById('close-modal');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteId = document.getElementById('note-id');
    
    // Display notes
    function displayNotes() {
        if (notesData.length === 0) {
            notesContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8 col-span-full">No notes yet. Create your first note!</p>';
            return;
        }
        
        notesContainer.innerHTML = '';
        notesData.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow';
            noteElement.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">${note.title || 'Untitled Note'}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500 dark:text-gray-400">${new Date(note.created_at).toLocaleDateString()}</span>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 edit-note" data-id="${note.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            notesContainer.appendChild(noteElement);
            
            // Add click event to open note for editing
            noteElement.addEventListener('click', function(e) {
                if (!e.target.classList.contains('edit-note') && !e.target.parentElement.classList.contains('edit-note')) {
                    openNoteModal(note.id);
                }
            });
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-note').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                openNoteModal(id);
            });
        });
    }
    
    // Open note modal
    function openNoteModal(id = null) {
        if (id) {
            // Edit existing note
            const note = notesData.find(note => note.id === id);
            if (note) {
                noteId.value = note.id;
                noteTitle.value = note.title || '';
                noteContent.value = note.content || '';
                deleteNoteBtn.classList.remove('hidden');
            }
        } else {
            // Create new note
            noteId.value = '';
            noteTitle.value = '';
            noteContent.value = '';
            deleteNoteBtn.classList.add('hidden');
        }
        
        noteModal.classList.remove('hidden');
    }
    
    // Close note modal
    function closeNoteModal() {
        noteModal.classList.add('hidden');
    }
    
    // Save note
    function saveNote() {
        const id = noteId.value;
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        
        if (!content) {
            alert('Note content cannot be empty!');
            return;
        }
        
        if (id) {
            // Update existing note
            const noteIndex = notesData.findIndex(note => note.id === id);
            if (noteIndex !== -1) {
                notesData[noteIndex].title = title;
                notesData[noteIndex].content = content;
                notesData[noteIndex].updated_at = Date.now();
            }
        } else {
            // Create new note
            const newNote = {
                id: generateId(),
                title: title,
                content: content,
                created_at: Date.now(),
                updated_at: Date.now()
            };
            notesData.unshift(newNote);
        }
        
        // Save to localStorage
        localStorage.setItem('notes_data', JSON.stringify(notesData));
        
        // Refresh display
        displayNotes();
        
        // Close modal
        closeNoteModal();
    }
    
    // Delete note
    function deleteNote() {
        const id = noteId.value;
        if (id && confirm('Are you sure you want to delete this note?')) {
            notesData = notesData.filter(note => note.id !== id);
            localStorage.setItem('notes_data', JSON.stringify(notesData));
            displayNotes();
            closeNoteModal();
        }
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event listeners
    addNoteBtn.addEventListener('click', () => openNoteModal());
    closeModal.addEventListener('click', closeNoteModal);
    saveNoteBtn.addEventListener('click', saveNote);
    deleteNoteBtn.addEventListener('click', deleteNote);
    
    // Close modal when clicking outside
    noteModal.addEventListener('click', function(e) {
        if (e.target === noteModal) {
            closeNoteModal();
        }
    });
    
    // Initial display
    displayNotes();
});