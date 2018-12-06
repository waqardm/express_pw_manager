
togglePassword = (id) => {
    const passwordRows = document.getElementById(id).getElementsByClassName('row-data');

    for(const row of passwordRows) {
        if(row.className.includes('hidden')) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    }
}