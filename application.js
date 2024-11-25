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

        this.initialize = this.initialize.bind(this);
        this.resizeHandler = this.resizeHandler.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
        this.displayEvents = this.displayEvents.bind(this);
    }

    initialize() {
        const view = this.getVisibleView();
        this.collectViews();
        this.collectMediaQueries();
        this.setViewOptions(view);
        this.fetchEvents(); // Mocked for testing
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
        // Mocking the API response
        const mockEvents = [
            { title: "Event 1", date: "2024-01-01", description: "This is a test event." },
            { title: "Event 2", date: "2024-01-02", description: "Another test event." }
        ];
        console.log("Mocked events fetched:", mockEvents);
        this.displayEvents(mockEvents);
    }

    async saveEvent(event) {
        // Mocking the save API response
        console.log("Mocked saveEvent called:", event);
        this.fetchEvents(); // Refresh the mocked events
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

export default Application;
