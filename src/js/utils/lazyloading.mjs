//---- lazy loaders
const lazyLoader = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        entry
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.src = url;
            observer.unobserve(entry.target);
        }
    })
})

function loadNextPage(endOfContainer, informacion, fun) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    informacion.page += 1;
                    informacion.clean = false
                    fun(informacion);
                    endOfContainer.remove();
                }
            });
        },
        {
            threshold: 1,
        }
    );

    observer.observe(endOfContainer);
}
//--- end lazy loaders

export { loadNextPage, lazyLoader }