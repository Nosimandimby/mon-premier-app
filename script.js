// Gestion Todo List avec localStorage, date, édition, catégories/priorités
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Ajout du select catégorie/priorité
    let categorySelect = document.getElementById('todo-category');
    if (!categorySelect) {
        categorySelect = document.createElement('select');
        categorySelect.id = 'todo-category';
        categorySelect.className = 'px-2 py-1 border rounded bg-white text-gray-700';
        ['Urgent', 'Important', 'Normal'].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        form.insertBefore(categorySelect, input.nextSibling);
    }

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item flex items-center justify-between border-b py-2';
            if (todo.completed) li.classList.add('completed', 'opacity-60');

            const left = document.createElement('div');
            left.className = 'flex items-center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.className = 'mr-2';
            checkbox.addEventListener('change', () => {
                todos[index].completed = !todos[index].completed;
                saveTodos();
                renderTodos();
            });

            const span = document.createElement('span');
            span.className = 'todo-text font-medium';
            span.textContent = todo.text;

            // Affichage de la date
            const dateSpan = document.createElement('span');
            dateSpan.className = 'text-xs text-gray-500 ml-2';
            dateSpan.textContent = todo.date;

            // Affichage catégorie/priorité
            const catSpan = document.createElement('span');
            catSpan.className = 'text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 ml-2';
            catSpan.textContent = todo.category;

            // Bouton édition
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn text-yellow-600 ml-2';
            editBtn.textContent = '✎';
            editBtn.title = 'Modifier';
            editBtn.addEventListener('click', () => {
                const newText = prompt('Modifier la tâche:', todo.text);
                if (newText && newText.trim()) {
                    todos[index].text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            });

            // Bouton suppression
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn text-red-600 ml-2';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Supprimer';
            deleteBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            left.appendChild(checkbox);
            left.appendChild(span);
            left.appendChild(editBtn);
            left.appendChild(dateSpan);
            left.appendChild(catSpan);

            li.appendChild(left);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        const category = categorySelect.value;
        if (text) {
            todos.push({
                text,
                completed: false,
                date: new Date().toLocaleString('fr-FR'),
                category
            });
            saveTodos();
            renderTodos();
            input.value = '';
        }
    });

    renderTodos();
});
