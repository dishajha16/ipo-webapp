// Helper: Format a date string into DD-MM-YYYY format
function formatDate(dateString) {
    if (!dateString || dateString === "Not Issued") return "Not Issued";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not Issued" : date.toLocaleDateString('en-GB').replace(/\//g, '-');
  }
  
  // Helper: Return a CSS class for status (adjust as needed)
  function getStatusClass(status) {
    switch(status.toLowerCase()){
      case 'ongoing': return 'ongoing';
      case 'upcoming': return 'upcoming';
      case 'new listed': return 'new-listed';
      default: return 'secondary';
    }
  }
  
  // Fetch and render IPO subscriptions dynamically
  async function fetchSubscriptions(page = 1) {
    try {
      const response = await fetch(`/api/ipoSubscriptions?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch IPO subscription data');
      const data = await response.json();
      
      // Update table rows dynamically
      const tbody = document.getElementById('subscriptionTbody');
      let rows = '';
      data.subscriptions.forEach(sub => {
        rows += `<tr>
          <td>${sub.companyName}</td>
          <td>${sub.priceBand}</td>
          <td>${formatDate(sub.openDate)}</td>
          <td>${formatDate(sub.closeDate)}</td>
          <td>${sub.issueSize}</td>
          <td>
            <span class="status ${getStatusClass(sub.status)}">
              ${sub.status}
            </span>
          </td>
          <td>
            <button class="apply-btn btn btn-primary" data-id="${sub._id}">Apply</button>
          </td>
        </tr>`;
      });
      tbody.innerHTML = rows;
  
      // Attach click event for Apply buttons (each time new rows are rendered)
      document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function() {
          alert("Your IPO application has been submitted!");
        });
      });
  
      // Update pagination UI
      const pagination = document.getElementById('subscriptionPagination');
      pagination.innerHTML = updateSubscriptionPaginationUI(data.currentPage, data.totalPages);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  }
  
  // Generate pagination HTML based on current page and total pages
  function updateSubscriptionPaginationUI(currentPage, totalPages) {
    let html = '';
  
    if (currentPage > 1) {
      html += `<li class="page-item">
                 <a class="page-link" href="?page=${currentPage - 1}">&laquo;</a>
               </li>`;
    }
  
    for (let i = 1; i <= totalPages; i++) {
      html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                 <a class="page-link" href="?page=${i}">${i}</a>
               </li>`;
    }
  
    if (currentPage < totalPages) {
      html += `<li class="page-item">
                 <a class="page-link" href="?page=${currentPage + 1}">&raquo;</a>
               </li>`;
    }
  
    return html;
  }
  
  // Filter function: Filter table rows based on search input
  function filterIPO() {
    const input = document.getElementById("searchIPO").value.toLowerCase();
    const rows = document.querySelectorAll("#subscriptionTbody tr");
    rows.forEach(row => {
      // Assumes the company name is in the first cell
      const companyName = row.cells[0].innerText.toLowerCase();
      row.style.display = companyName.includes(input) ? "" : "none";
    });
  }
  
  // DOMContentLoaded: Fetch initial data, set up pagination and search event listener
  document.addEventListener('DOMContentLoaded', () => {
    // Fetch the first page of subscriptions
    fetchSubscriptions();
  
    // Handle pagination clicks
    const pagination = document.getElementById('subscriptionPagination');
    pagination.addEventListener('click', async (event) => {
      event.preventDefault();
      const target = event.target.closest('a');
      if (!target) return;
      const url = new URL(target.href, window.location.origin);
      const page = url.searchParams.get('page');
      if (!page) return;
      await fetchSubscriptions(page);
    });
  
    // Attach search event listener to filter the table as user types
    document.getElementById('searchIPO').addEventListener('keyup', filterIPO);
  });
  