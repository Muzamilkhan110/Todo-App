import { useEffect, useRef, useState } from "react";

interface Todo {
  text: string;
  date: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;

    let updatedTodos;
    if (editIndex !== null) {
      updatedTodos = [...todos];
      updatedTodos[editIndex].text = input;
      setEditIndex(null);
    } else {
      const newTodo: Todo = {
        text: input,
        date: new Date().toLocaleString(),
      };
      updatedTodos = [...todos, newTodo];
    }
    setTodos(updatedTodos);
    setInput("");
  };

  const removeTodo = (index: number) => {
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  
    if (editIndex !== null) {
      if (editIndex === index) {
        setEditIndex(null);
        setInput("");
      } else if (editIndex > index) {
        setEditIndex(editIndex - 1)
      }
    }
  };
  

  const editTodo = (index: number) => {
    setInput(todos[index].text);
    setEditIndex(index);
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-center">Todo List</h1>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="border p-2 rounded w-full"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a task"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={addTodo}
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-lg text-center mb-2">Tasks</h1>
          <div className="bg-gray-100 p-3 rounded-lg h-64 overflow-y-auto shadow-inner">
            {todos.length > 0 ? (
              <ul>
                {todos.map((todo, index) => (
                  <li
                    key={index}
                    className="flex flex-col bg-white p-2 mt-2 shadow rounded"
                  >
                    <span className="font-medium">{todo.text}</span>
                    <span className="text-xs text-gray-500">Added: {todo.date}</span>
                    <div className="flex justify-end mt-2">
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => editTodo(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => removeTodo(index)}
                      >
                      Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No tasks added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
