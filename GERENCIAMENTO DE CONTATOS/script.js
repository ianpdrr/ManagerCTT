class ContactManager {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        this.renderContacts();
    }

    addContact(name, email, category) {
        this.contacts.push({ name, email, category });
        this.saveContacts();
    }

    editContact(index, name, email, category) {
        if (this.isIndexValid(index)) {
            this.contacts[index] = { name, email, category };
            this.saveContacts();
        }
    }

    deleteContact(index) {
        if (this.isIndexValid(index)) {
            this.contacts.splice(index, 1);
            this.saveContacts();
        }
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
        this.renderContacts();
    }

    renderContacts(filteredContacts = this.contacts) {
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';

        filteredContacts.forEach((contact, index) => {
            contactList.innerHTML += `
                <div class="contact-item">
                    <span class="index">${index + 1}</span> ${contact.name} - ${contact.email} (${contact.category})
                </div>
            `;
        });
    }

    isIndexValid(index) {
        return index >= 0 && index < this.contacts.length;
    }
}

const contactManager = new ContactManager();

function addContact() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const category = document.getElementById('category').value.trim();

    if (!email.includes('@') || !email.endsWith('.com')) {
        alert('Por favor, insira um email válido.');
        return;
    }

    contactManager.addContact(name, email, category);
    document.getElementById('contactForm').reset();
}

function openEditContact() {
    const index = parseInt(prompt("Digite o índice do contato a ser editado (1, 2, 3, ...):")) - 1;
    if (contactManager.isIndexValid(index)) {
        const contact = contactManager.contacts[index];
        const newName = prompt("Novo Nome (deixe vazio para não alterar):", contact.name);
        const newEmail = prompt("Novo Email (deixe vazio para não alterar):", contact.email);
        const newCategory = prompt("Nova Categoria (deixe vazio para não alterar):", contact.category);

        contactManager.editContact(index, 
            newName || contact.name, 
            newEmail || contact.email, 
            newCategory || contact.category
        );

        alert("Contato atualizado com sucesso!");
    } else {
        alert("Índice inválido. Por favor, insira um índice válido.");
    }
}

function openDeleteContact() {
    const index = parseInt(prompt("Digite o índice do contato a ser removido (1, 2, 3, ...):")) - 1;
    if (contactManager.isIndexValid(index)) {
        contactManager.deleteContact(index);
        alert("Contato removido com sucesso!");
    } else {
        alert("Índice inválido. Por favor, insira um índice válido.");
    }
}

function promptSearch() {
    const searchTerm = prompt("Digite o nome ou email do contato para buscar:");
    if (searchTerm) {
        const filteredContacts = contactManager.contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        contactManager.renderContacts(filteredContacts);
        
        setTimeout(() => {
            contactManager.renderContacts();
        }, 8000);
    }
}

function exportContacts() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        contactManager.contacts.map(contact => 
            `${contact.name},${contact.email},${contact.category}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contatos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
