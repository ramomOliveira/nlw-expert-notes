import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { Eraser } from 'lucide-react'
import { toast } from 'sonner'

interface NoteProps {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    return []
  })

  const onNoteCreated = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter((note) => note.id !== id)

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value

    setSearch(query)
  }

  const notesAllClear = () => {
    localStorage.removeItem('notes')
    setNotes([])

    toast.success('Todas as notas foram apagadas com sucesso!')
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <div className="flex flex-col-reverse gap-6 items-start md:flex-row md:items-center justify-center">
        <form className="w-full">
          <input
            className="w-full bg-transparent text-2xl md:text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
            type="text"
            placeholder="Busque em suas notas..."
            onChange={handleSearch}
          />
        </form>

        <button
          className="flex gap-2 items-center justify-center text-red-400 hover:text-red-500 whitespace-nowrap text-sm"
          onClick={notesAllClear}
          type="button"
        >
          <Eraser className="size-4" />
          <span>Apagar tudo</span>
        </button>
      </div>

      <div className="h-px bg-slate-600" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  )
}
