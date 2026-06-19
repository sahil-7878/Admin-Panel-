// ==========================================
// DOM READY & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initAllDropdowns();
    initSidebarToggle();
    initImagePreview();
    initAddAdminValidation();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Dashboard charts (ONLY if dashboard page)
    if (document.getElementById('revenueChart')) {
        initDashboardCharts();
    }
});

// ==========================================
// 1. SIDEBAR & NAVBAR LOGIC (Preserved)
// ==========================================

function initAllDropdowns() {
    const setup = (btnId, menuId, iconId) => {
        const btn = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        const icon = document.getElementById(iconId);

        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            // IF COLLAPSED: Do not toggle (CSS Hover handles it)
            if (document.body.classList.contains('sidebar-collapsed')) return;

            e.stopPropagation();
            menu.classList.toggle('hidden');

            if (icon) {
                icon.style.transform = menu.classList.contains('hidden')
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)';
            }
        });
    };

    setup('dropdown-btn', 'dropdown-menu', 'dropdown-icon'); // Admin
    setup('cat-dropdown-btn', 'cat-dropdown-menu', 'cat-dropdown-icon'); // Category
    setup('sub-cat-dropdown-btn', 'sub-cat-dropdown-menu', 'sub-cat-dropdown-icon'); // Sub-Category
    setup('prod-dropdown-btn', 'prod-dropdown-menu', 'prod-dropdown-icon'); // Products
    setup('user-menu-btn', 'user-dropdown', 'user-chevron'); // User

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.standard-dropdown').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.chevron-icon').forEach(i => i.style.transform = 'rotate(0deg)');
    });
}

function initSidebarToggle() {
    const desktopCollapseBtn = document.getElementById('desktop-collapse-btn');
    const collapseIcon = document.getElementById('collapse-icon');
    const body = document.body;

    // Desktop
    if (desktopCollapseBtn) {
        desktopCollapseBtn.addEventListener('click', () => {
            body.classList.toggle('sidebar-collapsed');
            if (collapseIcon) {
                collapseIcon.style.transform = body.classList.contains('sidebar-collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            localStorage.setItem('sidebar-state', body.classList.contains('sidebar-collapsed') ? 'collapsed' : 'expanded');
        });
        if (localStorage.getItem('sidebar-state') === 'collapsed') {
            body.classList.add('sidebar-collapsed');
            if (collapseIcon) collapseIcon.style.transform = 'rotate(180deg)';
        }
    }

    // Mobile
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (mobileBtn && sidebar) {
        let activeOverlay = overlay;
        if (!activeOverlay) {
            activeOverlay = document.createElement('div');
            activeOverlay.id = 'sidebar-overlay';
            activeOverlay.className = 'fixed inset-0 bg-slate-900/50 z-30 hidden transition-opacity opacity-0 md:hidden';
            document.body.appendChild(activeOverlay);
        }

        mobileBtn.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            activeOverlay.classList.remove('hidden');
            setTimeout(() => activeOverlay.classList.remove('opacity-0'), 10);
        });

        activeOverlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            activeOverlay.classList.add('opacity-0');
            setTimeout(() => activeOverlay.classList.add('hidden'), 300);
        });
    }
}

// ==========================================
// 2. DASHBOARD CHARTS (Preserved)
// ==========================================
function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 22000, 24000, 28000],
                    backgroundColor: '#4f46e5',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    }
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Organic'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#6366f1', '#60a5fa', '#cbd5e1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '75%',
                plugins: { legend: { display: false } }
            }
        });
    }
}

// ==========================================
// 3. ADD ADMIN PAGE LOGIC (Preserved)
// ==========================================
function initImagePreview() {
    const imgInput = document.getElementById('adminImage');
    const imgPreview = document.getElementById('imagePreview');
    if (!imgInput || !imgPreview) return;
    imgInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = e => imgPreview.src = e.target.result;
            reader.readAsDataURL(this.files[0]);
        }
    });
}

function initAddAdminValidation() {
    const form = document.getElementById('addAdminForm');
    const errorContainer = document.getElementById('client-error-container');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        const fnameInput = document.getElementById('fname');
        const lnameInput = document.getElementById('lname');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const dateInput = document.getElementById('date-field');
        const descInput = document.getElementById('description');
        const imageInput = document.getElementById('adminImage');
        const genderChecked = document.querySelector('input[name="gender"]:checked');
        const hobbiesChecked = document.querySelectorAll('input[name="hobby"]:checked');
        let errorMessage = '';

        if (!fnameInput || !fnameInput.value.trim()) errorMessage = "First Name is required.";
        else if (!lnameInput || !lnameInput.value.trim()) errorMessage = "Last Name is required.";
        else if (!emailInput || !emailInput.value.trim()) errorMessage = "Email Address is required.";
        else if (!passwordInput || !passwordInput.value.trim()) errorMessage = "Password is required.";
        else if (!dateInput || !dateInput.value) errorMessage = "Date Joined is required.";
        else if (!genderChecked) errorMessage = "Please select a Gender.";
        else if (hobbiesChecked.length === 0) errorMessage = "Please select at least one Hobby.";
        else if (!descInput || !descInput.value.trim()) errorMessage = "Short Bio / Description is required.";
        else if (!imageInput || imageInput.files.length === 0) errorMessage = "Profile Image is required.";

        if (errorMessage) {
            e.preventDefault();
            if (errorContainer) {
                errorContainer.textContent = errorMessage;
                errorContainer.classList.remove('hidden');
                errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert(errorMessage);
            }
            return false;
        }
        if (errorContainer) errorContainer.classList.add('hidden');
    });
}

// ==========================================
// 4. VIEW / EDIT / DELETE ACTIONS (Fixed)
// ==========================================

// --- UTILS: MODAL HANDLING ---
window.openModalContent = function (html) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (overlay && content) {
        content.innerHTML = html;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        // Animation delay
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};

window.closeModal = function () {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (overlay && content) {
        overlay.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }, 200);
    }
};

const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// --- VIEW ADMIN ---
window.viewAdmin = function (id) {
    fetch(`/adminDetails/${id.trim()}`)
        .then(res => {
            // Check if the response is actually JSON
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                // If not JSON (likely HTML login page), reload to force login
                window.location.reload();
                throw new Error("Session expired");
            }
            return res.json();
        })
        .then(admin => {
            const date = admin.date ? new Date(admin.date).toLocaleDateString() : 'N/A';

            const html = `
                <div class="relative h-24 w-full">
                    <button onclick="closeModal()" class="absolute top-4 right-4 transition">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="px-6 pb-6 -mt-12">
                    <div class="flex flex-col items-center">
                        <img src="${admin.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=${admin.name}'" 
                            class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover">
                        <h2 class="text-xl font-bold text-slate-800 mt-3">${admin.name}</h2>
                        <p class="text-slate-500 text-sm">${admin.email}</p>
                        <span class="mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide rounded-full border border-indigo-100">
                            ${admin.role || 'Admin'}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <span class="block text-xs text-slate-400 uppercase font-bold">Location</span>
                            <span class="text-sm font-medium text-slate-700">${admin.city || 'Global'}</span>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <span class="block text-xs text-slate-400 uppercase font-bold">Joined</span>
                            <span class="text-sm font-medium text-slate-700">${date}</span>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-sm font-bold text-slate-700 mb-2">About</h4>
                        <p class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            ${admin.desc || 'No description available.'}
                        </p>
                    </div>
                    
                    <div class="mt-4">
                        <h4 class="text-sm font-bold text-slate-700 mb-2">Hobbies</h4>
                        <div class="flex flex-wrap gap-2">
                            ${(admin.hobby || []).map(h => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">${h}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            openModalContent(html);
        })
        .catch(err => {
            console.error(err);
            alert("Error loading details");
        });
};

// --- OPEN EDIT MODAL ---
window.openEditModal = function (id) {
    fetch(`/adminDetails/${id.trim()}`)
        .then(res => {
            // Check if the response is actually JSON
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                // If not JSON (likely HTML login page), reload to force login
                window.location.reload(); 
                throw new Error("Session expired");
            }
            return res.json();
        })
        .then(admin => {
            const dateVal = admin.date ? new Date(admin.date).toISOString().split('T')[0] : '';
            const nameParts = admin.name ? admin.name.split(' ') : [];
            const fname = nameParts[0] || '';
            const lname = nameParts.slice(1).join(' ') || '';
            const isChecked = (val) => admin.hobby && admin.hobby.includes(val) ? 'checked' : '';

            const html = `
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 class="font-bold text-lg text-slate-800">Edit Profile</h3>
                    <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <form id="editForm" onsubmit="saveEdit(event, '${admin._id}')" class="p-6 space-y-4">
                    <div class="flex items-center gap-4">
                        <img id="edit-preview" src="${admin.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=${admin.name}'" class="w-16 h-16 rounded-full object-cover border border-slate-200">
                        <div class="flex-1">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Update Photo</label>
                            <input type="file" id="edit-image-input" onchange="previewEditImage(this)" class="block w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="label-style">First Name</label><input type="text" id="edit-fname" value="${fname}" class="input-style" required></div>
                        <div><label class="label-style">Last Name</label><input type="text" id="edit-lname" value="${lname}" class="input-style" required></div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="label-style">Email</label><input type="email" id="edit-email" value="${admin.email}" class="input-style" required></div>
                        <div><label class="label-style">Date Joined</label><input type="date" id="edit-date" value="${dateVal}" class="input-style" required></div>
                    </div>

                    <div>
                        <label class="label-style">Role</label>
                        <input type="text" value="${admin.role || 'Admin'}" class="input-style bg-slate-100 text-slate-500 cursor-not-allowed" disabled>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="label-style">Password</label><input type="password" id="edit-password" placeholder="Leave blank to keep" class="input-style"></div>
                        <div>
                            <label class="label-style">Gender</label>
                            <div class="flex gap-4 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="edit-gender" value="Male" ${admin.gender === 'Male' ? 'checked' : ''} class="text-indigo-600"><span class="text-sm">Male</span></label>
                                <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="edit-gender" value="Female" ${admin.gender === 'Female' ? 'checked' : ''} class="text-indigo-600"><span class="text-sm">Female</span></label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="label-style mb-2 block">Hobbies</label>
                        <div class="flex flex-wrap gap-2">
                            ${['Coding', 'Design', 'Marketing', 'Reading', 'Travelling', 'Gaming'].map(h => `
                                <label class="cursor-pointer inline-flex items-center bg-slate-50 px-3 py-1 rounded border border-slate-200">
                                    <input type="checkbox" name="edit-hobby" value="${h}" ${isChecked(h)} class="rounded text-indigo-600 mr-2">
                                    <span class="text-sm text-slate-600">${h}</span>
                                </label>`).join('')}
                        </div>
                    </div>

                    <div><label class="label-style">Bio</label><textarea id="edit-desc" rows="2" class="input-style">${admin.desc || ''}</textarea></div>

                    <div class="flex justify-end gap-2 pt-2">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">Save Changes</button>
                    </div>
                </form>
                <style>.label-style{display:block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem;} .input-style{width: 100%; border: 1px solid #cbd5e1; rounded-lg; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s;} .input-style:focus{border-color: #6366f1; ring: 2px solid #e0e7ff;}</style>
            `;
            openModalContent(html);
        })
        .catch(err => {
            console.error(err);
            alert("Error loading edit form");
        });
};

// --- PREVIEW EDIT IMAGE ---
window.previewEditImage = function (input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('edit-preview').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
};

// --- SAVE EDIT ---
window.saveEdit = function (e, id) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fname', document.getElementById('edit-fname').value);
    formData.append('lname', document.getElementById('edit-lname').value);
    formData.append('email', document.getElementById('edit-email').value);
    formData.append('gender', document.querySelector('input[name="edit-gender"]:checked')?.value || '');
    formData.append('date', document.getElementById('edit-date').value);
    formData.append('desc', document.getElementById('edit-desc').value);

    const passInput = document.getElementById('edit-password');
    if (passInput && passInput.value.trim() !== '') {
        formData.append('password', passInput.value);
    }

    document.querySelectorAll('input[name="edit-hobby"]:checked').forEach(cb => formData.append('hobby', cb.value));

    const imageInput = document.getElementById('edit-image-input');
    if (imageInput && imageInput.files.length > 0) {
        formData.append('avatar', imageInput.files[0]);
    }

    fetch(`/update-admin/${id}`, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                closeModal();
                window.location.reload();
            } else {
                alert(result.message || 'Update failed');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong during update');
        });
};

// --- DELETE ADMIN ---
window.deleteAdmin = function (id) {
    if (!confirm("Are you sure you want to permanently delete this admin?")) {
        return;
    }

    fetch(`/delete-admin/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success || result.message === 'Admin deleted successfully') { // Adjust based on your backend response
                // Remove row from UI instantly or reload
                const row = document.getElementById(`row-${id}`); // Ensure your TR has id="row-USER_ID"
                if (row) {
                    row.remove();
                } else {
                    window.location.reload();
                }
            } else {
                alert("Failed to delete admin.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting admin.");
        });
};