import React, { useState, useEffect } from "react";
import axios from "axios";
import noteService from "./services/note";
import "./index.css";
const App = () => {
  // State for storing notes and new note input
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(""); // Let's add a new piece of state called newNote for storing the user-submitted input and let's set it as the input element's value attribute:
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  // Fetch notes from server on component mount
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);
  console.log("render", "notes");

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }

    return <div className="error">{message}</div>;
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // Add a new note
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    };
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  // Note component
  const Note = ({ note, toggleImportance }) => {
    const label = note.important ? "make not important" : "make important";

    return (
      <li className="note">
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    );
  };

  // Update newNote state when input changes
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }; // To enable editing of the input element, we have to register an event handler that synchronizes the changes made to the input with the component's state:
  //The event handler is called every time a change occurs in the input element. The event handler function receives the event object as its event parameter:
  // const result = condition ? val1 : val2

  // Filter notes based on showAll state
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {Array.isArray(notesToShow) ? (
          notesToShow.map((note) => <Note key={note.id} note={note} />)
        ) : (
          <li>No notes to show</li>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
