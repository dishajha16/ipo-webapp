// helpers/statusHelpers.js
module.exports = {
    getStatusColor(status) {
      if (!status) return 'secondary';
      switch (status.toLowerCase()) {
        case 'ongoing': return 'success';
        case 'coming': return 'warning';
        case 'new listed': return 'danger';
        default: return 'secondary';
      }
    }
  };
  