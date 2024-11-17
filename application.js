class Application {
    constructor() {
        // Initialize all properties
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

        // Bind context to methods
        this.initialize = this.initialize.bind(this);
        this.resizeHandler = this.resizeHandler.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
        this.displayEvents = this.displayEvents.bind(this);
    }

    initialize() {
        // Initialization
        const view = this.getVisibleView();
        this.collectViews();
        this.collectMediaQueries();
        this.setViewOptions(view);
        this.fetchEvents(); // Fetch events from the backend on initialization
        window.addEventListener("resize", this.resizeHandler);
        console.log("Application Initialized");
    }

    getVisibleView() {
        return this.views.find(view => view.style.display === "block");
    }

    setViewOptions(view) {
        // Configure view
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
        // Collect media queries for each view
        console.log("Collecting media queries...");
    }

    resizeHandler() {
        this.scaleViewsToFit && this.views.forEach(view => this.scaleViewToFit(view));
    }

    async fetchEvents() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/events`);
            if (response.ok) {
                const events = await response.json();
                console.log("Fetched events:", events);
                this.displayEvents(events);
            } else {
                console.error("Failed to fetch events:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    async saveEvent(event) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                console.log("Event saved successfully:", event);
                this.fetchEvents(); // Refresh the events after saving
            } else {
                console.error("Failed to save event:", response.statusText);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
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
}

export default Application; // 
