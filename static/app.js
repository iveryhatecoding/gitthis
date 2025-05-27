function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toISOString().split('T')[0];
}



document.addEventListener("DOMContentLoaded", function () {
    const lookupForm = document.getElementById("lookupForm");
    if (lookupForm) {
        lookupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const clientId = document.getElementById("clientId").value;
            const includeCompliance = document.getElementById("includeCompliance").checked;
            
            let apiUrl = `/client/${clientId}`;
            
            if (includeCompliance) {
                apiUrl += "?include_compliance=true";
            }

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Client not found");
                        return;
                    }

                    document.getElementById("field-client-id").textContent = data.Client_id;
                    document.getElementById("field-name").textContent = data.Name;
                    document.getElementById("field-nationality").textContent = data.Nationality;
                    document.getElementById("field-contact").textContent = data.Contact_number;
                    document.getElementById("field-email").textContent = data.Email_address;

                    document.getElementById("clientDetails").style.display = "block";

                    if (includeCompliance) {
                        document.getElementById("field-onboarded").textContent = data.Onboarded_date || 'N/A';
                        document.getElementById("field-service").textContent = data.Service_type || 'N/A';
                        document.getElementById("field-client-type").textContent = data.Client_type || 'N/A';
                        document.getElementById("field-pep").textContent = data.Pep || 'N/A';
                        document.getElementById("field-risk").textContent = data.Risk_rating || 'N/A';
                        document.getElementById("field-last-assessment").textContent = data.Last_periodic_risk_assessment || 'N/A';
                        document.getElementById("field-next-assessment").textContent = data.Next_periodic_risk_assessment || 'N/A';
                        document.getElementById("field-rm").textContent = data.Relationship_Manager || 'N/A';
                        
                        document.getElementById("complianceDetails").style.display = "block";
                    } else {
                        document.getElementById("complianceDetails").style.display = "none";
                    }
                })
                .catch(error => {
                    console.error("Error fetching data: ", error);
                    alert("Error fetching client data.");
                });
        });
    }
    const toggleBtn = document.getElementById("toggleComplianceBtn");
    const complianceSection = document.getElementById("complianceSection");

    if (toggleBtn && complianceSection) {
    toggleBtn.addEventListener("click", function () {
        const isVisible = window.getComputedStyle(complianceSection).display === "block";
        complianceSection.style.display = isVisible ? "none" : "block";
        toggleBtn.textContent = isVisible ? "Add Compliance Info" : "Hide Compliance Info";
    });
}

    
    const addClientForm = document.getElementById("addClientForm");
    if (addClientForm) {
        addClientForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = {
                // Client Data
                Name: formData.get("name"),
                Date_of_birth: formData.get("date_of_birth"),
                Contact_number: formData.get("contact_number"),
                Email_address: formData.get("email_address"),
                Nationality: formData.get("nationality"),
                Residency_address: formData.get("residency_address"),
                Employment_status: formData.get("employment_status"),
                Age: formData.get("age"),
                IC_number: formData.get("ic_number"),
                Client_profile: formData.get("client_profile"),
            
                // Compliance Data (optional)
                Onboarded_date: formData.get("onboarded_date"),    
                Last_periodic_risk_assessment: formData.get("last_assessment"),
                Next_periodic_risk_assessment: formData.get("next_assessment"),
                Risk_rating: formData.get("risk_rating"),
                Relationship_Manager: formData.get("relationship_manager"),
                Service_type: formData.get("service_type"),
                Client_type: formData.get("client_type"),
                Pep: formData.get("pep")
            };
            
            
            
                
            

            fetch("/add-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert("Client added successfully!");
                // Optionally redirect or reset the form
                addClientForm.reset();
            })
            .catch(error => {
                console.error("Error adding client:", error);
                alert("Failed to add client.");
            });
        });
    
    }
    const updateClientIdInput = document.getElementById("client_id");
    if (updateClientIdInput) {
        updateClientIdInput.addEventListener("change", function () {
            const clientId = updateClientIdInput.value;
            if (!clientId) return;

            fetch(`/client/${clientId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Client not found.");
                        return;
                    }

                    // Fill client fields
                    document.getElementById("name").value = data.Name || '';
                    document.getElementById("date_of_birth").value = formatDate(data.Date_of_birth);
                    document.getElementById("contact_number").value = data.Contact_number || '';
                    document.getElementById("email_address").value = data.Email_address || '';
                    document.getElementById("nationality").value = data.Nationality || '';
                    document.getElementById("residency_address").value = data.Residency_address || '';
                    document.getElementById("employment_status").value = data.Employment_status || '';
                    document.getElementById("age").value = data.Age || '';
                    document.getElementById("ic_number").value = data.Ic_number || '';
                    document.getElementById("client_profile").value = data.Client_profile || '';

                    // Fill compliance fields (if present)
                    document.querySelector("[name='onboarded_date']").value = formatDate(data.Onboarded_date);
                    document.querySelector("[name='last_assessment']").value = formatDate(data.Last_periodic_risk_assessment);
                    document.querySelector("[name='next_assessment']").value = formatDate(data.Next_periodic_risk_assessment);
                    document.querySelector("[name='risk_rating']").value = data.Risk_rating || '';
                    document.querySelector("[name='relationship_manager']").value = data.Relationship_Manager || '';
                    document.querySelector("[name='service_type']").value = data.Service_type || '';
                    document.querySelector("[name='client_type']").value = data.Client_type || '';
                    document.querySelector("[name='pep']").value = data.Pep || '';
                })
                .catch(error => {
                    console.error("Error fetching client data:", error);
                    alert("Something went wrong.");
                });
        });
    }
    const updateClientForm = document.getElementById("updateClientForm");
    if (updateClientForm) {
        updateClientForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(updateClientForm);
            const data = {
                Client_id: formData.get("client_id"),
                Name: formData.get("name"),
                Date_of_birth: formData.get("date_of_birth"),
                Contact_number: formData.get("contact_number"),
                Email_address: formData.get("email_address"),
                Nationality: formData.get("nationality"),
                Residency_address: formData.get("residency_address"),
                Employment_status: formData.get("employment_status"),
                Age: formData.get("age"),
                IC_number: formData.get("ic_number"),
                Client_profile: formData.get("client_profile"),
                Onboarded_date: formData.get("onboarded_date"),
                Last_periodic_risk_assessment: formData.get("last_assessment"),
                Next_periodic_risk_assessment: formData.get("next_assessment"),
                Risk_rating: formData.get("risk_rating"),
                Relationship_Manager: formData.get("relationship_manager"),
                Service_type: formData.get("service_type"),
                Client_type: formData.get("client_type"),
                Pep: formData.get("pep")
            };

            fetch("/update-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    if (result.message) {
                        alert("Client updated successfully!");
                        updateClientForm.reset();
                    } else {
                        alert("Update failed: " + result.error);
                    }
                })
                .catch(error => {
                    console.error("Error updating client:", error);
                    alert("Failed to update client.");
                });
        });
    }
    const deleteBtn = document.getElementById("deleteClientBtn");

    if (deleteBtn) {
        deleteBtn.addEventListener("click", function () {
            const clientId = document.getElementById("clientId").value;
            if (!clientId) {
                alert("Please enter a Client ID first.");
                return;
            }

            if (!confirm("Are you sure you want to delete this client?")) return;

            fetch(`/delete-client/${clientId}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message) {
                        alert("Client deleted successfully.");
                        document.getElementById("clientDetails").style.display = "none";
                        document.getElementById("complianceDetails").style.display = "none";
                    } else {
                        alert("Delete failed: " + data.error);
                    }
                })
                .catch((err) => {
                    console.error("Error:", err);
                    alert("An error occurred while deleting.");
                });
        });
    }

    function loadTasks() {
        fetch("/get_tasks")
            .then(response => response.json())
            .then(data => {
                const todoColumn = document.getElementById("todo-column");
                const doneColumn = document.getElementById("done-column");
                todoColumn.innerHTML = "";
                doneColumn.innerHTML = "";
    
                data.forEach(task => {
                    const div = document.createElement("div");
                    div.className = "task";
                    div.setAttribute("draggable", "true");
                    div.setAttribute("data-id", task.id);
                    div.innerHTML = `
                        <strong>${task.client_name}</strong><br>
                        RM: ${task.rm}<br>
                        Docs: ${task.documents.join(", ")}<br>
                        Doc Link: ${task.doc_link}<br>
                        EMA/IMA: ${task.ema_ima}<br>
                        Assigned To: ${task.assigned_to}<br>
                        <button class="delete-task" onclick="deleteTask(${task.id})">×</button>
                    `;
    
                    if (task.done) {
                        doneColumn.appendChild(div);
                    } else {
                        todoColumn.appendChild(div);
                    }
                });
            })
            .catch(err => {
                console.error("Failed to load tasks:", err);
            });
    }
    loadTasks();
});
function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    fetch(`/delete_task/${id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadTasks();
        } else {
            alert("Failed to delete task.");
        }
    })
    .catch(err => {
        console.error("Delete error:", err);
    });
}
