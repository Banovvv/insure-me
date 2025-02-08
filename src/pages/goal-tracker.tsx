import { useState, useEffect } from "react";
import { ProgressBar } from "../components/progress-bar";

type Goal = {
    id: string;
    title: string;
    description: string;
    progress: number;
    category: string;
};


const LOCAL_STORAGE_KEY = "user_goals";

const loadGoals = (): Goal[] => {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedGoals ? JSON.parse(storedGoals) : [];
};

const saveGoals = (goals: Goal[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
};

const GoalTracker = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [newGoal, setNewGoal] = useState({ title: "", description: "", category: "" });

    useEffect(() => {
        setGoals(loadGoals());
    }, []);

    const addGoal = () => {
        if (!newGoal.title || !newGoal.category) {
            alert("Please enter a title and category.");
            return;
        }

        const newGoalObject: Goal = {
            id: crypto.randomUUID(),
            title: newGoal.title,
            description: newGoal.description,
            progress: 0,
            category: newGoal.category,  // Store category when adding the goal
        };

        const updatedGoals = [...goals, newGoalObject];
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
        setNewGoal({ title: "", description: "", category: "" });
    };

    const updateProgress = (id: string, value: number) => {
        const updatedGoals = goals.map((goal) =>
            goal.id === id
                ? { ...goal, progress: Math.min(goal.progress + value, 100) }
                : goal
        );

        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const uncompleteGoal = (id: string) => {
        const updatedGoals = goals.map((goal) =>
            goal.id === id ? { ...goal, progress: 3 } : goal // BUG: Should be set to 0, not 3
        );

        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const clearCompletedGoals = () => {
        const updatedGoals = goals.filter((goal) => goal.progress < 100);
        setGoals(updatedGoals);
        saveGoals(updatedGoals);
    };

    const currentGoals = goals.filter((goal) => goal.progress < 100);
    const completedGoals = goals.filter((goal) => goal.progress >= 100);

    return (
        <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Goal Tracker</h2>

            {/* Add Goal Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Goal Title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <label htmlFor="goal-category" style={{ display: "none" }}>Goal Category</label>
                <select
                    id="goal-category"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                    <option value="">Select a category</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                </select>
                <button
                    onClick={addGoal}
                    style={{ padding: "10px", backgroundColor: "#a17fe0", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                >
                    Add Goal
                </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <label htmlFor="category-select" style={{ display: "none" }}>Select Category</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                    <option value="All">All Categories</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="work">Health</option>
                </select>
            </div>

            {/* Goals Columns */}
            <div style={{ display: "flex", gap: "16px" }}>
                {/* Current Goals */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ textAlign: "center" }}>Current Goals</h3>
                    {currentGoals.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#666" }}>No active goals.</p>
                    ) : (
                        currentGoals.filter((goal) => selectedCategory === "All" || goal.category === selectedCategory).map((goal) => (
                            <div key={goal.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginBottom: "12px", backgroundColor: "#fff" }}>
                                <h4 style={{ marginBottom: "4px" }}>{goal.title}</h4>
                                <p style={{ fontSize: "14px", color: "#444", marginBottom: "4px" }}>{goal.description}</p>
                                <p style={{ fontSize: "14px", color: "#444", marginBottom: "4px" }}>
                                    Category: {goal.category}  {/* Display the category */}
                                </p>
                                <ProgressBar progress={goal.progress} />
                                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                    <button
                                        style={{ padding: "8px 12px", backgroundColor: "#59C173", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                                        onClick={() => updateProgress(goal.id, 5)}
                                    >
                                        +5
                                    </button>
                                    <button
                                        // BUG: borderRadius should be set to 15, not 15
                                        style={{ padding: "8px 12px", backgroundColor: "#a17fe0", color: "white", border: "none", borderRadius: "15px", cursor: "pointer" }}
                                        onClick={() => updateProgress(goal.id, 10)}
                                    >
                                        +10
                                    </button>
                                    <button
                                        // BUG: Should be set to 25, not 24
                                        style={{ padding: "8px 12px", backgroundColor: "#5D26C1", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                                        onClick={() => updateProgress(goal.id, 24)}
                                    >
                                        +25
                                    </button>
                                    <button
                                        style={{ padding: "8px 12px", backgroundColor: "#FF6347", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                                        onClick={() => uncompleteGoal(goal.id)}
                                    >
                                        Uncomplete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Completed Goals */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ textAlign: "center" }}>Completed Goals</h3>
                    {completedGoals.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#666" }}>No completed goals yet.</p>
                    ) : (
                        completedGoals.filter((goal) => selectedCategory === "All" || goal.category === selectedCategory).map((goal) => (
                            <div key={goal.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginBottom: "12px", backgroundColor: "#F8F9FA" }}>
                                <h4 style={{ marginBottom: "4px" }}>{goal.title}</h4>
                                <p style={{ fontSize: "14px", color: "#444", marginBottom: "4px" }}>{goal.description}</p>
                                <p style={{ fontSize: "14px", color: "#444", marginBottom: "4px" }}>
                                    Category: {goal.category}  {/* Display the category */}
                                </p>
                                <ProgressBar progress={100} />
                                <button
                                    style={{ padding: "8px 12px", backgroundColor: "#FF6347", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", marginTop: "8px" }}
                                    onClick={() => uncompleteGoal(goal.id)}
                                >
                                    Uncomplete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Clear Completed Goals Button */}
            <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                    style={{ padding: "10px", backgroundColor: "#FF6347", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
                    onClick={clearCompletedGoals}
                >
                    Clear All Completed Goals
                </button>
            </div>
        </div>
    );
};

export default GoalTracker;
