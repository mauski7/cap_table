// Sample data - this is where the magic happens!
let stakeholders = [
    { name: "John Doe", type: "Founder", shares: 6000000, percentage: 60.0 },
    { name: "Jane Smith", type: "Co-Founder", shares: 2500000, percentage: 25.0 },
    { name: "Option Pool", type: "Employee Pool", shares: 1500000, percentage: 15.0 },
];

let companyValuation = 5000000;

// Render the cap table
function renderCapTable() {
    const tbody = document.getElementById('cap-table-body');
    const totalShares = stakeholders.reduce((sum, s) => sum + s.shares, 0);
    
    tbody.innerHTML = stakeholders.map((stakeholder, index) => {
        const shareValue = (stakeholder.shares / totalShares) * companyValuation;
        
        return `
            <tr class="table-row">
                <td class="table-cell">
                    <div class="stakeholder-info">
                        <div class="stakeholder-avatar">
                            ${stakeholder.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span class="stakeholder-name">${stakeholder.name}</span>
                    </div>
                </td>
                <td class="table-cell">
                    <span class="stakeholder-type ${stakeholder.type.toLowerCase().replace(' ', '-')}">
                        ${stakeholder.type}
                    </span>
                </td>
                <td class="table-cell shares">
                    ${stakeholder.shares.toLocaleString()}
                </td>
                <td class="table-cell percentage">
                    ${stakeholder.percentage.toFixed(1)}%
                </td>
                <td class="table-cell value">
                    $${Math.round(shareValue).toLocaleString()}
                </td>
                <td class="table-cell">
                    <button onclick="removeStakeholder(${index})" class="remove-btn">Remove</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update total shares counter
    document.getElementById('total-shares').textContent = totalShares.toLocaleString();
    document.getElementById('stakeholder-count').textContent = stakeholders.length;
}

// Add a random stakeholder for fun
function addRandomStakeholder() {
    const names = ["Alex Johnson", "Sam Chen", "Riley Taylor", "Morgan Davis", "Casey Wilson"];
    const types = ["Advisor", "Investor", "Employee"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomShares = Math.floor(Math.random() * 500000) + 100000;
    
    // Recalculate percentages
    const newTotalShares = stakeholders.reduce((sum, s) => sum + s.shares, 0) + randomShares;
    
    stakeholders.forEach(s => {
        s.percentage = (s.shares / newTotalShares) * 100;
    });
    
    stakeholders.push({
        name: randomName,
        type: randomType,
        shares: randomShares,
        percentage: (randomShares / newTotalShares) * 100
    });
    
    renderCapTable();
}

// Remove stakeholder
function removeStakeholder(index) {
    if (confirm('Are you sure you want to remove this stakeholder?')) {
        stakeholders.splice(index, 1);
        
        // Recalculate percentages
        const totalShares = stakeholders.reduce((sum, s) => sum + s.shares, 0);
        stakeholders.forEach(s => {
            s.percentage = (s.shares / totalShares) * 100;
        });
        
        renderCapTable();
    }
}

// Dilution calculator
function showDilutionCalc() {
    document.getElementById('dilution-modal').classList.remove('hidden');
    document.getElementById('dilution-modal').classList.add('flex');
}

function closeDilutionCalc() {
    document.getElementById('dilution-modal').classList.add('hidden');
    document.getElementById('dilution-modal').classList.remove('flex');
}

function calculateDilution() {
    const investment = parseFloat(document.getElementById('investment-amount').value) || 0;
    const sharePrice = parseFloat(document.getElementById('share-price').value) || 0;
    
    if (investment <= 0 || sharePrice <= 0) {
        alert('Please enter valid amounts');
        return;
    }
    
    const newShares = investment / sharePrice;
    const currentTotalShares = stakeholders.reduce((sum, s) => sum + s.shares, 0);
    const newTotalShares = currentTotalShares + newShares;
    
    const dilutionResult = document.getElementById('dilution-result');
    dilutionResult.innerHTML = `
        <h4 class="font-bold text-brand-navy">📈 Impact Analysis</h4>
        <p><strong>New shares issued:</strong> ${Math.round(newShares).toLocaleString()}</p>
        <p><strong>New total shares:</strong> ${Math.round(newTotalShares).toLocaleString()}</p>
        <p><strong>Investor ownership:</strong> ${((newShares / newTotalShares) * 100).toFixed(2)}%</p>
        <p class="text-orange-600"><strong>Founder dilution:</strong> ${(((stakeholders[0].shares / currentTotalShares) - (stakeholders[0].shares / newTotalShares)) * 100).toFixed(2)}%</p>
    `;
    dilutionResult.classList.remove('hidden');
}

// Export functionality (just downloads sample data)
function exportData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Type,Shares,Percentage,Value\n"
        + stakeholders.map(s => {
            const value = (s.shares / stakeholders.reduce((sum, st) => sum + st.shares, 0)) * companyValuation;
            return `${s.name},${s.type},${s.shares},${s.percentage.toFixed(2)}%,$${Math.round(value)}`;
        }).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cap-table-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('📊 Cap table exported successfully!');
}

// Scenarios (placeholder)
function showScenarios() {
    alert('🔮 Future scenarios coming soon!\n\nThis will let you model:\n• Series A funding rounds\n• Employee option grants\n• Exit scenarios\n• And more!');
}

// Initialize the app
function initializeApp() {
    renderCapTable();
    
    // Add some nice loading animation
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    }, 100);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
