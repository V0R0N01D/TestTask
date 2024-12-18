﻿class PoemSearch {
    constructor() {
        this.searchBox = document.getElementById("searchBox");
        this.suggestionsBox = document.getElementById("suggestions");
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.searchBox.addEventListener("input", () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.handleSearch(), 300);
        });

        this.searchBox.addEventListener("focus", () => {
            if (this.searchBox.value.trim()) {
                this.handleSearch();
            }
        });

        document.addEventListener("click", (e) => this.handleClickOutside(e));

        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
                .forEach(el => new bootstrap.Tooltip(el)));
    }

    async handleSearch() {
        const query = this.searchBox.value.trim();

        if (!query) {
            this.hideSuggestions();
            return;
        }

        try {
            const response = await fetch(`/api/poems?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.updateSuggestions(data);
        } catch (error) {
            this.showError();
        }
    }

    updateSuggestions(data) {
        this.suggestionsBox.innerHTML = "";

        if (data.length > 0) {
            this.suggestionsBox.classList.add("show");
            data.forEach(item => this.addSuggestion(item));
        } else {
            this.showNoResults();
        }
    }

    addSuggestion(item) {
        const button = document.createElement("button");
        button.className = "dropdown-item py-2 px-3";
        button.innerHTML = `
            <div class="suggestion-title">${item.title}</div>
            <div class="suggestion-author text-muted">${item.author_name}</div>
        `;
        button.onclick = () => this.selectSuggestion(item);
        this.suggestionsBox.appendChild(button);
    }

    selectSuggestion(item) {
        this.searchBox.value = `${item.title} - ${item.author_name}`;
        this.hideSuggestions();
    }

    showNoResults() {
        this.suggestionsBox.classList.add("show");
        this.suggestionsBox.innerHTML = `
            <div class="dropdown-item text-muted text-center py-2">
                Ничего не найдено
            </div>
        `;
    }

    showError() {
        this.suggestionsBox.classList.add("show");
        this.suggestionsBox.innerHTML = `
            <div class="dropdown-item text-danger text-center py-2">
                Произошла ошибка при поиске
            </div>
        `;
    }

    hideSuggestions() {
        this.suggestionsBox.classList.remove("show");
        this.suggestionsBox.innerHTML = "";
    }

    handleClickOutside(e) {
        if (!this.searchBox.contains(e.target) && !this.suggestionsBox.contains(e.target)) {
            this.hideSuggestions();
        }
    }
}