const correctPassword = "199700";
const companyList = document.getElementById("companyList");

// Load companies from LocalStorage
document.addEventListener("DOMContentLoaded", function() {
    const companies = JSON.parse(localStorage.getItem("companies")) || [];
    companies.forEach(displayCompany);
});

document.getElementById("addCompanyForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const companyNameInput = document.getElementById("companyNameInput");
    const companyIdInput = document.getElementById("companyIdInput");
    const fileInput = document.getElementById("fileInput");
    const passwordInput = document.getElementById("uploadPassword");

    if (passwordInput.value === correctPassword) {
        const companyName = companyNameInput.value;
        const companyId = companyIdInput.value;
        const file = fileInput.files[0];

        if (companyName && companyId && file && file.type === "application/pdf") {
            const reader = new FileReader();

            reader.onload = function (e) {
                const company = {
                    name: companyName,
                    id: companyId,
                    fileName: file.name,
                    fileContent: e.target.result // Store the file content as a base64 string
                };

                // Save company to LocalStorage
                const companies = JSON.parse(localStorage.getItem("companies")) || [];
                companies.push(company);
                localStorage.setItem("companies", JSON.stringify(companies));

                displayCompany(company);

                // Reset form inputs
                companyNameInput.value = "";
                companyIdInput.value = "";
                fileInput.value = "";
                passwordInput.value = "";
            };

            reader.readAsDataURL(file); // Read the file as a data URL
        } else {
            alert("يرجى إدخال جميع البيانات وتحديد ملف PDF صحيح.");
        }
    } else {
        alert("كلمة السر غير صحيحة!");
    }
});

function displayCompany(company) {
    const companyItem = document.createElement("div");
    companyItem.className = "company-item";

    const companyInfo = document.createElement("span");
    companyInfo.textContent = `اسم الشركة: ${company.name} | رقم القيد: ${company.id} | ملف: ${company.fileName}`;

    const openButton = document.createElement("button");
    openButton.textContent = "فتح";
    openButton.onclick = function () {
        window.open(company.fileContent, '_blank');
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "حذف";
    deleteButton.onclick = function () {
        const deletePassword = prompt("أدخل كلمة السر لحذف الشركة:");
        if (deletePassword === correctPassword) {
            companyList.removeChild(companyItem);

            // Remove company from LocalStorage
            let companies = JSON.parse(localStorage.getItem("companies")) || [];
            companies = companies.filter(c => c.id !== company.id);
            localStorage.setItem("companies", JSON.stringify(companies));
        } else {
            alert("كلمة السر غير صحيحة!");
        }
    };

    companyItem.appendChild(companyInfo);
    companyItem.appendChild(openButton);
    companyItem.appendChild(deleteButton);
    companyList.appendChild(companyItem);
}

document.getElementById("searchButton").addEventListener("click", function () {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const companies = document.querySelectorAll(".company-item");

    companies.forEach(function (company) {
        const companyId = company.querySelector("span").textContent.toLowerCase();
        if (companyId.includes(searchValue)) {
            company.style.display = "";
        } else {
            company.style.display = "none";
        }
    });
});