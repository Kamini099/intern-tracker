document.addEventListener("DOMContentLoaded", function () {
  const companyNameInput = document.getElementById("companyName");
  const positionInput = document.getElementById("position");
  const statusSelect = document.getElementById("status");
  const deadlineInput = document.getElementById("deadline");
  const oaDateInput = document.getElementById("oaDate");
  const addApplicationButton = document.getElementById("addApplication");
  const applicationList = document.getElementById("applicationList");

  // Load existing applications from Chrome storage
  chrome.storage.sync.get("applications", function (data) {
    const savedApplications = data.applications || [];
    displayApplications(savedApplications);
  });

  addApplicationButton.addEventListener("click", function () {
    if (validateForm()) {
      const companyName = companyNameInput.value;
      const position = positionInput.value;
      const status = statusSelect.value;
      const deadline = deadlineInput.value;
      const oaDate = oaDateInput.value;

      // Load existing applications from Chrome storage
      chrome.storage.sync.get("applications", function (data) {
        const savedApplications = data.applications || [];
        const newApplication = {
          companyName,
          position,
          status,
          deadline,
          oaDate,
        };

        // Add the new application
        savedApplications.push(newApplication);

        // Save updated applications to Chrome storage
        chrome.storage.sync.set(
          { applications: savedApplications },
          function () {
            displayApplications(savedApplications);
          }
        );

        // Clear the form
        clearForm();
      });
    }
  });

  // Remove application when delete button is clicked
  applicationList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const index = event.target.dataset.index;

      // Load existing applications from Chrome storage
      chrome.storage.sync.get("applications", function (data) {
        const savedApplications = data.applications || [];
        savedApplications.splice(index, 1);

        // Save updated applications to Chrome storage
        chrome.storage.sync.set(
          { applications: savedApplications },
          function () {
            displayApplications(savedApplications);
          }
        );
      });
    }
  });

  // Fill Form button click event
  const fillFormButton = document.getElementById("fillForm");
  fillFormButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        action: "fillForm",
        companyName: "Example Company",
        position: "Software Engineer Intern",
        status: "applied",
        deadline: "2024-08-31",
        oaDate: "2024-08-15",
      });
    });
  });

  // Validate form inputs
  function validateForm() {
    if (!companyNameInput.checkValidity()) {
      alert("Please enter a valid company name.");
      return false;
    }

    if (!positionInput.checkValidity()) {
      alert("Please enter a valid position.");
      return false;
    }

    return true;
  }

  // Display applications in the popup
  function displayApplications(applications) {
    applicationList.innerHTML = "";
    applications.forEach((application, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <div>
        <div>
          <strong>${application.companyName}</strong> - ${application.position}
        </div>
        <div>
          <strong>Status:</strong> ${application.status}
      
        </div>
        <div>
          <strong>Deadline:</strong> ${application.deadline || "Not provided"}
        </div>
        <div>
          <strong>OA Date:</strong> ${application.oaDate || "Not provided"}
        </div>
        <button class="delete-button" data-index="${index}">Delete</button>
      </div>
      `;
      applicationList.appendChild(listItem);
    });
  }

  // Clear the form
  function clearForm() {
    companyNameInput.value = "";
    positionInput.value = "";
    statusSelect.value = "applied";
    deadlineInput.value = "";
    oaDateInput.value = "";
  }
});
