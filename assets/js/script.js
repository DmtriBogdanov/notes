const NOTES = [
  // {
  //   id: 1,
  //   title: 'Работа с формами',
  //   description: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
  //   color: 'green',
  //   isFavorite: false,
  // },
  // {
  //   id: 2,
  //   title: 'Работа с формами',
  //   description: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
  //   color: 'green',
  //   isFavorite: false,
  // },
  // {
  //   id: 3,
  //   title: 'Работа с формами',
  //   description: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
  //   color: 'green',
  //   isFavorite: true,
  // },
]

const model = {
  notes: NOTES,
  isShowOnlyFavorite: false,

  toggleShowOnlyFavorite() {
    this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
  },
  addNote(title, description, color) {
    const note = {
      id: new Date().getTime(),
      title: title,
      isFavorite: false,
      description: description,
      color: color,
    }
    this.notes.unshift(note);
    this.updateNotesView();
  },
  toggleFavorite(noteId) {
    this.notes = this.notes.map(note => {
      if (note.id === noteId) {
        note.isFavorite = !note.isFavorite;
      }
      return note;
    })
    this.updateNotesView();
  },
  deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== noteId);
    this.updateNotesView();
  },
  updateNotesView() {
    let notesToRender = this.notes

    if (this.isShowOnlyFavorite) {
      notesToRender = this.notes.filter(note => note.isFavorite)
    }

    view.renderNotes(notesToRender)
    view.renderNotesCount(notesToRender)
  }

}

const view = {
  init() {
    this.renderNotes(model.notes)
    this.renderNotesCount(model.notes)

    const form = document.querySelector('.note-form')
    const notesList = document.querySelector('.notes__list')
    const showOnlyFavorite = document.querySelector('.filter__checkbox')

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const title = form.elements["name"].value
      const description = form.elements["description"].value
      const radioColors = form.elements["color"]
      const colorChecked = Array.from(radioColors).find(color => color.checked)
      const color = colorChecked.value

      const isSuccess = controller.addNote(title, description, color)
      if (isSuccess) form.reset()
    })

    notesList.addEventListener('click', (e) => {
      const noteItem = e.target.closest('.notes__item')
      if (!noteItem) return

      const noteId = +noteItem.id

      if (e.target.classList.contains('notes__favorite')) {
        controller.toggleFavorite(noteId)
      }

      if (e.target.classList.contains('notes__delete')) {
        controller.deleteNote(noteId)
      }
    })

    showOnlyFavorite.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter__checkbox')) {
        controller.toggleShowOnlyFavorite()
        controller.updateNotesView()
      }
    })
  },

  renderNotes(notes) {
    const notesList = document.querySelector(".notes__list")
    const notesInner = document.querySelector('.notes__inner')
    if (!notesList || !notesInner) return

    notesList.innerHTML = ''

    const oldEmpty = notesInner.querySelector('.notes__empty')
    if (oldEmpty) oldEmpty.remove()

    if (notes.length > 0) {
      notes.forEach(note => {
        const noteHTML = `
          <li id="${note.id}" class="notes__item ${note.isFavorite ? "favorite" : ""}">
            <div style="background-color: ${note.color}" class="notes__header">
              <span class="notes__title">${note.title}</span>
              <div class="notes__actions">
                <button class="notes__favorite" type="button" title="${note.isFavorite ? "Удалить из избранного" : "Добавить в избранное"}"></button>
                <button class="notes__delete" type="button"  title="Удалить заметку"></button>
              </div>
            </div>
            <div class="notes__description">
              <p>${note.description}</p>
            </div>
          </li>
        `
        notesList.insertAdjacentHTML('beforeend', noteHTML)
      })
    } else {
      const notesEmptyMessage = model.isShowOnlyFavorite
        ? `
          <div class="notes__empty">
            <p class="notes__empty-text">У вас нет еще ни одной избранной заметки</p>
            <p class="notes__empty-text">Отметьте важные, чтобы они появились здесь.</p>
          </div>`
        : `
          <div class="notes__empty">
            <p class="notes__empty-text">У вас нет еще ни одной заметки</p>
            <p class="notes__empty-text">Заполните поля выше и создайте свою первую заметку!</p>
          </div>`
      notesInner.insertAdjacentHTML('beforeend', notesEmptyMessage)
    }
  },
  renderNotesCount(notes) {
    const notesCount = document.querySelector(".header__count-all")
    const totalCount = model.notes.length
    const visibleCount = notes.length

    if (model.isShowOnlyFavorite) {
      notesCount.textContent =  `${visibleCount} из ${totalCount}`
    } else {
      notesCount.textContent = totalCount
    }
  },
  displayMessage(message, isError = false) {
    const messageBox = document.querySelector('.messages-box')
    const messageContainer = document.createElement("div")
    messageContainer.className = `message ${isError ? 'error' : 'success'}`

    const messageText = document.createElement("span")
    messageText.className = "message__text"
    messageText.textContent = message

    messageContainer.append(messageText)
    messageBox.prepend(messageContainer)

    setTimeout(() => {
      messageContainer.remove()
    }, 3000)
  }
}


const controller = {
  addNote(title, description, color) {
    if (!title?.trim() || !description?.trim()) {
      view.displayMessage('Заполните все поля', true);
      return false;
    }

    if (title.trim().length > 50) {
      view.displayMessage('Максимальная длина заголовка - 50 символов', true);
      return false;
    }

    model.addNote(title.trim(), description.trim(), color);
    view.displayMessage('Заметка добавлена!');
    return true;
  },
  toggleFavorite(noteId) {
    model.toggleFavorite(noteId)
  },
  deleteNote(noteId) {
    model.deleteNote(noteId)
    view.displayMessage('Заметка удалена')
  },
  toggleShowOnlyFavorite() {
    model.toggleShowOnlyFavorite()
  },
  updateNotesView() {
    model.updateNotesView()
  }
}

view.init()