class LeaderboardModal {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.leaderboardModal = null;
        this.createAndShowModal();
    }

    createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    createAndShowModal() {
        this.leaderboardModal = this.createElement('div', 'leaderboard-modal');
        const leaderboardContent = this.createElement('div', 'modal-content');
        
        const leaderboardTitle = this.createElement('h2', '', 'Leaderboard');
        leaderboardContent.appendChild(leaderboardTitle);

        const leaderboardTable = this.createElement('div', 'leaderboard-table');
        const leaderboard = storageManager.getLeaderboard();
        this.updateTable(leaderboardTable, leaderboard);
        leaderboardContent.appendChild(leaderboardTable);

        const closeBtn = this.createElement('button', 'btn', 'Close');
        closeBtn.onclick = () => this.destroy();
        leaderboardContent.appendChild(closeBtn);

        this.leaderboardModal.appendChild(leaderboardContent);
        document.body.appendChild(this.leaderboardModal);

        this.leaderboardModal.style.display = 'flex';
    }

    updateTable(tableElement, leaderboard) {
        tableElement.innerHTML = '';
        
        if (leaderboard.length === 0) {
            const noRecords = this.createElement('p', '', 'No records yet');
            tableElement.appendChild(noRecords);
            return;
        }

        const table = this.createElement('table', 'leaderboard');
        const headerRow = this.createElement('tr', '');
        
        const positionHeader = this.createElement('th', '', '#');
        const nameHeader = this.createElement('th', '', 'Name');
        const scoreHeader = this.createElement('th', '', 'Score');
        const dateHeader = this.createElement('th', '', 'Date');
        
        headerRow.appendChild(positionHeader);
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(scoreHeader);
        headerRow.appendChild(dateHeader);
        table.appendChild(headerRow);

        leaderboard.forEach((record, index) => {
            const row = this.createElement('tr', '');

            const positionCell = this.createElement('td', '', (index + 1).toString());
            const nameCell = this.createElement('td', '', record.name);
            const scoreCell = this.createElement('td', '', record.score.toString());
            const dateCell = this.createElement('td', '', record.date);
            
            row.appendChild(positionCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);
            table.appendChild(row);
        });

        tableElement.appendChild(table);
    }

    destroy() {
        if (this.leaderboardModal && this.leaderboardModal.parentNode) {
            this.leaderboardModal.parentNode.removeChild(this.leaderboardModal);
        }
    }
}