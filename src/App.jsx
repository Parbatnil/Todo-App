import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import DisplayBlank from "./components/DisplayBlank";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(false);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleChange = (event) => {
    setTodo(event.target.value);
  };

  const handleClick = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS();
  };

  const handleCheckbox = (event) => {
    const id = event.target.name;
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    saveToLS();
  };

  const handleEdit = (event, id) => {
    let t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);

    let newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS();
  };

  const handleDelete = (event, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        let newTodos = todos.filter((item) => item.id !== id);
        setTodos(newTodos);
        saveToLS();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const toggleFinished = () => {
    setShowFinished((prevState) => !prevState);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 bg-[#d2efee] p-4 rounded-xl min-h-[80vh] w-full sm:w-3/4 lg:w-3/4">
        <div className="flex flex-col items-center justify-center space-y-4 my-10 ">
          <h1 className="text-4xl my-6 font-bold ">Todo App- Add your task</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 ">
            <input
              type="text"
              placeholder="Enter your tasks"
              onChange={handleChange}
              value={todo}
              className="bg-green-100 border-2 border-green-300 w-full p-2 rounded-md selection:border-black text-[#5E001F] placeholder:text-green-500 sm:w-10/12 md:w-96"
            />
            <button
              className="bg-[#00E1D9] text-[#5E001F] py-2 px-4 rounded-xl font-bold cursor-pointer hover:bg-green-700 hover:text-white disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={todo.length <= 3}
              onClick={handleClick}
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
            className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded accent-green-500"
          />
          <label htmlFor="checkbox" className="text-xl font-semibold px-2">
            Show Finished
          </label>
        </div>
        <div className="h-[1px] bg-black w-[90%] mx-auto my-5 opacity-35"></div>

        {todos.length !== 0 ? (
          <div>
            {todos.map((item) => {
              return (
                (showFinished || !item.isCompleted) && (
                  <div key={item.id} className="todos px-2">
                    <h2 className="text-xl font-semibold py-2">Your Todos</h2>
                    <div className="todo-display flex justify-between py-2 items-center bg-[#c2e8e8] rounded mb-2">
                      <div className="flex">
                        <input
                          name={item.id}
                          onChange={handleCheckbox}
                          type="checkbox"
                          checked={item.isCompleted}
                        />
                        <div
                          className={
                            item.isCompleted
                              ? "font-medium text-[#5E001F] line-through"
                              : "font-medium text-[#5E001F]"
                          }
                        >
                          {item.todo}
                        </div>
                      </div>
                      <div className="button space-x-4">
                        <button
                          className="bg-[#00E1D9] text-[#5E001F] py-2 px-4 rounded-xl font-bold cursor-pointer hover:bg-green-700 hover:text-white"
                          onClick={(event) => handleEdit(event, item.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-[#00E1D9] text-[#5E001F] py-2 px-4 rounded-xl font-bold cursor-pointer hover:bg-green-700 hover:text-white"
                          onClick={(event) => {
                            handleDelete(event, item.id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        ) : (
          <DisplayBlank />
        )}
      </div>
    </>
  );
};

export default App;
