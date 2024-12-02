class Application {
    constructor() {
        this.prefix = "--web-";
        this.NAVIGATION_CHANGE = "viewChange";
        this.initialized = false;
        this.views = [];
        this.viewsDictionary = {};
        this.applicationStylesheet = null;
        this.viewScale = 1;
        this.enableDeepLinking = true;
        this.scaleViewsToFit = false;
        this.apiBaseUrl = "http://127.0.0.1:5000"; // Backend URL
        this.events = []; // Store events locally

        this.initialize = this.initialize.bind(this);
        this.resizeHandler = this.resizeHandler.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
        this.displayEvents = this.displayEvents.bind(this);
        this.initializeCalendar = this.initializeCalendar.bind(this);
        this.removeEventFromStorage = this.removeEventFromStorage.bind(this);
    }

    initialize() {
        const view = this.getVisibleView();
        this.collectViews();
        this.collectMediaQueries();
        this.setViewOptions(view);
        this.fetchEvents(); // Mocked for testing
        this.initializeCalendar(); 
        this.displayCurrentDate(); 
        window.addEventListener("resize", this.resizeHandler);
        console.log("Application Initialized");
    }

    getVisibleView() {
        return this.views.find(view => view.style.display === "block");
    }

    setViewOptions(view) {
        this.scaleViewsToFit = true;
        if (view) {
            this.scaleViewToFit(view);
        }
    }

    scaleViewToFit(view) {
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;
        const viewWidth = parseFloat(getComputedStyle(view).width);
        const viewHeight = parseFloat(getComputedStyle(view).height);
        const scale = Math.min(availableWidth / viewWidth, availableHeight / viewHeight);

        view.style.transform = `scale(${scale})`;
        console.log(`Scaled view to fit: ${scale}`);
        return scale;
    }

    collectViews() {
        const viewIds = this.getViewIds();
        this.views = viewIds.map(id => document.getElementById(id));
        console.log("Collected Views:", this.views);
    }

    getViewIds() {
        return Array.from(document.querySelectorAll("[data-view-id]")).map(el => el.id);
    }

    collectMediaQueries() {
        console.log("Collecting media queries...");
    }

    resizeHandler() {
        this.scaleViewsToFit && this.views.forEach(view => this.scaleViewToFit(view));
    }

    async fetchEvents() {
        const mockEvents = [
            { id: 1, title: "Event 1", date: "2024-01-01", description: "This is a test event." },
            { id: 2, title: "Event 2", date: "2024-01-02", description: "Another test event." }
        ];
        console.log("Mocked events fetched:", mockEvents);
        this.events = mockEvents;
        this.displayEvents(mockEvents);
    }

    async saveEvent(event) {
        const uniqueId = Date.now(); 
        const newEvent = { ...event, id: uniqueId };
        console.log("Mocked saveEvent called:", newEvent);
        this.events.push(newEvent); 
        this.displayEvents(this.events); 
    }

    displayEvents(events) {
        const eventListContainer = document.getElementById("event-list");
        if (!eventListContainer) {
            console.warn("No container with ID 'event-list' found for displaying events.");
            return;
        }

        eventListContainer.innerHTML = ""; // Clear the container
        events.forEach(event => {
            const eventItem = document.createElement("div");
            eventItem.className = "event-item";
            eventItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>Description: ${event.description}</p>
            `;
            eventListContainer.appendChild(eventItem);
        });
    }

    initializeCalendar() {
        const calendarEl = document.getElementById("calendar");
        if (!calendarEl) {
            console.warn("No container with ID 'calendar' found.");
            return;
        }

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            dateClick: (info) => {
                const title = prompt("Enter event title:");
                if (title) {
                    const newEvent = { title, date: info.dateStr, description: "Added via calendar" };
                    this.saveEvent(newEvent); // Add event to local storage
                    calendar.addEvent({ id: newEvent.id, title, start: info.dateStr });
                }
            },
            eventClick: (info) => {
                const confirmDelete = confirm(`Do you want to remove the event "${info.event.title}"?`);
                if (confirmDelete) {
                    info.event.remove(); // Remove the event from the calendar
                    this.removeEventFromStorage(info.event.id); // Remove the event from storage
                }
            }
        });

        calendar.render();
        this.calendar = calendar; 
    }

    removeEventFromStorage(eventId) {
        this.events = this.events.filter(event => event.id !== eventId); 
        console.log(`Event with ID ${eventId} removed.`);
    }

    displayCurrentDate() {
        const currentDate = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        const dateContainer = document.getElementById("current-date");
        if (dateContainer) {
            dateContainer.innerHTML = `<p>Today's Date: ${currentDate}</p>`;
        } else {
            console.warn("No container with ID 'current-date' found.");
        }
    }
}

export default Application;
