// helpers/dateHelpers.js
module.exports = {
    formatDate(dateString) {
      if (!dateString || dateString === 'Not Issued') return 'Not Issued';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Not Issued' : date.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
  };
  