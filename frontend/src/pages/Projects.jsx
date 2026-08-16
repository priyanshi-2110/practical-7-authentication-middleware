import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../api";

function Projects() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [saving, setSaving] = useState(false);

    // ========================================
    // GET - Load all tasks
    // ========================================

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTasks();

            setTasks(data);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    // Load tasks when component starts
    useEffect(() => {
        loadTasks();
    }, []);

    // ========================================
    // POST - Create a new task
    // ========================================

    const handleCreate = async (e) => {
        e.preventDefault();

        // Validate title
        if (!title.trim()) {
            setError("Task title is required");
            toast.error("Task title is required");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const newTask = await createTask({
                title: title,
                description: description,
                priority: priority,
                completed: false,
            });

            // Update React state
            setTasks((prev) => [...prev, newTask]);

            // Success message
            toast.success("Task created successfully!");

            // Clear form
            setTitle("");
            setDescription("");
            setPriority("medium");

        } catch (err) {
            setError(err.message);
            toast.error("Failed to create task");

        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // PUT - Update task
    // ========================================

    const handleUpdate = async (task) => {
        try {
            setError("");

            const updatedTask = await updateTask(task._id, {
                title: task.title,
                description: task.description,
                priority: task.priority,
                completed: !task.completed,
            });

            // Update task in React state
            setTasks((prev) =>
                prev.map((item) =>
                    item._id === updatedTask._id
                        ? updatedTask
                        : item
                )
            );

            toast.success("Task updated successfully!");

        } catch (err) {
            setError(err.message);
            toast.error("Failed to update task");
        }
    };

    // ========================================
    // DELETE - Delete task
    // ========================================

    const handleDelete = async (id) => {

        // Confirmation dialog
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        // If user clicks Cancel
        if (!confirmed) {
            return;
        }

        try {
            setError("");

            // Delete from backend
            await deleteTask(id);

            // Remove from React state
            setTasks((prev) =>
                prev.filter((task) => task._id !== id)
            );

            toast.success("Task deleted successfully!");

        } catch (err) {
            setError(err.message);
            toast.error("Failed to delete task");
        }
    };

    // ========================================
    // Loading state
    // ========================================

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Task Manager</h2>
                <p>Loading tasks...</p>
            </div>
        );
    }

    // ========================================
    // UI
    // ========================================

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "900px",
                margin: "auto",
            }}
        >

            <h1>Task Manager</h1>

            {/* Error message */}

            {error && (
                <p
                    style={{
                        color: "red",
                        fontWeight: "bold",
                    }}
                >
                    {error}
                </p>
            )}

            {/* ========================================
                CREATE TASK FORM
            ======================================== */}

            <form onSubmit={handleCreate}>

                <div style={{ marginBottom: "10px" }}>

                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        style={{
                            padding: "8px",
                            width: "250px",
                        }}
                    />

                </div>

                <div style={{ marginBottom: "10px" }}>

                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        style={{
                            padding: "8px",
                            width: "250px",
                        }}
                    />

                </div>

                <div style={{ marginBottom: "10px" }}>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                        style={{
                            padding: "8px",
                        }}
                    >
                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>

                </div>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: "8px 15px",
                        cursor: saving
                            ? "not-allowed"
                            : "pointer",
                    }}
                >
                    {saving
                        ? "Adding..."
                        : "Add Task"}
                </button>

            </form>

            <hr
                style={{
                    margin: "30px 0",
                }}
            />

            {/* ========================================
                DISPLAY TASKS
            ======================================== */}

            <h2>Tasks</h2>

            {tasks.length === 0 ? (

                <p>No tasks found.</p>

            ) : (

                tasks.map((task) => (

                    <div
                        key={task._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                        }}
                    >

                        <h3>
                            {task.title}
                        </h3>

                        <p>
                            <strong>
                                Description:
                            </strong>{" "}
                            {task.description}
                        </p>

                        <p>
                            <strong>
                                Priority:
                            </strong>{" "}
                            {task.priority}
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {task.completed
                                ? "Completed"
                                : "Pending"}
                        </p>

                        {/* UPDATE BUTTON */}

                        <button
                            onClick={() =>
                                handleUpdate(task)
                            }
                        >
                            {task.completed
                                ? "Mark Pending"
                                : "Mark Completed"}
                        </button>

                        {/* DELETE BUTTON */}

                        <button
                            onClick={() =>
                                handleDelete(task._id)
                            }
                            style={{
                                marginLeft: "10px",
                            }}
                        >
                            Delete
                        </button>

                    </div>

                ))
            )}

        </div>
    );
}

export default Projects;