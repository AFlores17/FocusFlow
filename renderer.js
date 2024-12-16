document.addEventListener("DOMContentLoaded", () => {
    const views = document.querySelectorAll('.view');
    const navButtons = document.querySelectorAll("#bottom-navigation button");
    const addButton = document.getElementById("add-button");
    const colorSelector = document.getElementById("color-selector"); // Color selector dropdown
    const resetColorButton = document.getElementById("reset-color"); // Reset color button

    // Event Storage
    let tasks = [];

    // Function to switch views
    const showView = (viewId) => {
        views.forEach(view => view.classList.remove("active"));
        navButtons.forEach(btn => btn.classList.remove("active"));

        document.getElementById(viewId).classList.add("active");
        const nav = document.querySelector(`#bottom-navigation button[data-target='${viewId}']`);
        if (nav) nav.classList.add("active");

        // Refresh data when switching views
        if (viewId === "daily-overview-view") displayDailyTasks();
        if (viewId === "weekly-overview-view") displayWeeklyTasks();
    };

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetView = button.getAttribute("data-target");
            showView(targetView);
        });
    });

    showView("task-details-view"); // Default View

    // Calendar Initialization
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        editable: true,
        dateClick: (info) => {
            showView("task-creation-view");
            document.getElementById("task-date").value = info.dateStr;
        },
        eventClick: (info) => {
            const confirmEdit = confirm(`Edit or delete "${info.event.title}"?`);
            if (confirmEdit) {
                const editTitle = prompt("Edit Task Name:", info.event.title);
                if (editTitle) {
                    info.event.setProp("title", editTitle);
                } else {
                    info.event.remove();
                    tasks = tasks.filter(task => task.id !== info.event.id);
                }
            }
        }
    });
    calendar.render();

    // Task Creation Form
    const taskForm = document.getElementById("task-form");
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName = document.getElementById("task-name").value;
        const taskDate = document.getElementById("task-date").value;
        const taskImportance = document.getElementById("task-importance").value;

        if (taskName && taskDate) {
            const newTask = {
                id: Date.now().toString(),
                title: `${taskName} (Priority: ${taskImportance})`,
                start: taskDate
            };

            tasks.push(newTask); // Store the task in the array
            calendar.addEvent(newTask);

            alert("Task added to calendar!");
            taskForm.reset();
            showView("task-details-view");
        }
    });

    // Display tasks for "today"
    const displayDailyTasks = () => {
        const dailyContainer = document.getElementById("daily-tasks");
        dailyContainer.innerHTML = ""; // Clear container

        const today = getLocalDate();
        const heading = document.createElement("h2");
        heading.textContent = "Daily Overview";
        dailyContainer.appendChild(heading);

        const todaysTasks = tasks.filter(task => task.start === today);
        if (todaysTasks.length > 0) {
            todaysTasks.forEach(task => {
                const taskItem = document.createElement("div");
                taskItem.textContent = task.title;
                taskItem.className = "task-item";
                dailyContainer.appendChild(taskItem);
            });
        } else {
            const noTasks = document.createElement("p");
            noTasks.textContent = "No tasks for today!";
            dailyContainer.appendChild(noTasks);
        }
    };

    // Display tasks for the current week
    const displayWeeklyTasks = () => {
        const weeklyContainer = document.getElementById("weekly-tasks");
        weeklyContainer.innerHTML = ""; // Clear container

        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const heading = document.createElement("h2");
        heading.textContent = "Weekly Overview";
        weeklyContainer.appendChild(heading);

        const weeklyTasks = tasks.filter(task => {
            const taskDate = new Date(task.start);
            return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        if (weeklyTasks.length > 0) {
            weeklyTasks.forEach(task => {
                const taskItem = document.createElement("div");
                taskItem.textContent = `${task.title} - ${task.start}`;
                taskItem.className = "task-item";
                weeklyContainer.appendChild(taskItem);
            });
        } else {
            const noTasks = document.createElement("p");
            noTasks.textContent = "No tasks this week!";
            weeklyContainer.appendChild(noTasks);
        }
    };

    // Local date string (YYYY-MM-DD)
    const getLocalDate = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    // Start of the week (Sunday)
    const getStartOfWeek = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        return start;
    };

    // Theme Toggle
    const lightThemeBtn = document.getElementById("light-theme");
    const darkThemeBtn = document.getElementById("dark-theme");

    lightThemeBtn.addEventListener("click", () => {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    });

    darkThemeBtn.addEventListener("click", () => {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    });

    // Color Selector
    colorSelector.addEventListener("change", (e) => {
        document.body.style.backgroundColor = e.target.value;
    });

    // Reset Background Color
    resetColorButton.addEventListener("click", () => {
        document.body.style.backgroundColor = "";
    });
});
