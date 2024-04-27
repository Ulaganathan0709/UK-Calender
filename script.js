document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'https://www.gov.uk/bank-holidays.json';
    let currentPage = 1;
    const recordsPerPage = 5;

    function fetchHolidays() {
        fetch(baseUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const holidays = data['england-and-wales'].events;
                displayHolidays(holidays, currentPage);
                setupPagination(holidays, recordsPerPage);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    function displayHolidays(holidays, page) {
        const start = (page - 1) * recordsPerPage;
        const end = start + recordsPerPage;
        const paginatedItems = holidays.slice(start, end);

        const tableBody = document.querySelector('#holidays-table tbody');
        tableBody.innerHTML = '';

        paginatedItems.forEach(holiday => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Holiday Name">${holiday.title}</td>
                <td data-label="Date">${holiday.date}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function setupPagination(holidays, recordsPerPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const pageCount = Math.ceil(holidays.length / recordsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const btn = paginationButton(i, holidays);
            pagination.appendChild(btn);
        }
    }

    function paginationButton(page, holidays) {
        const button = document.createElement('button');
        button.innerText = page;
        button.classList.add('page-btn');
        if (currentPage == page) button.classList.add('active');

        button.addEventListener('click', function() {
            currentPage = page;
            displayHolidays(holidays, currentPage);

            let currentBtn = document.querySelector('.page-btn.active');
            currentBtn.classList.remove('active');

            button.classList.add('active');
        });

        return button;
    }

    fetchHolidays();
});
