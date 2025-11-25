document.addEventListener('DOMContentLoaded', function() {
    const litecoinBtn = document.getElementById('litecoin-btn');
    const notification = document.getElementById('copy-notification');
    
    const litecoinAddress = 'LgCn2zpBbWwMfsZG2EfvvwuiYf7Y7JWAZ4';
    
    litecoinBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        navigator.clipboard.writeText(litecoinAddress).then(() => {
            showNotification();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            notification.querySelector('span').textContent = 'Failed to copy address';
            showNotification();
        });
    });
    
    function showNotification() {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});