 const loading = () => {
    const loading = document.createElement('div')
    loading.className = 'loading'
    loading.style.position = 'absolute'
    loading.style.width = '100vw'
    loading.style.height = '150vh'
    loading.style.top = '0'
    loading.style.left = '0'
    loading.style.textAlign = 'center'
    loading.style.backgroundColor = 'rgba(255,255,255,255)'
    document.body.style.overflow = 'hidden'
    loading.style.zIndex = '100'
    loading.innerHTML = 
    `<div class="loading-text"><img src='../asssets/imgs/loading.gif' width=30%/><h4>LOADING...</h4></div>`
    document.body.appendChild(loading)
}

 const removeLoading = () => {
    const loading = document.querySelector('.loading')
    loading.remove()
}

window.addEventListener('DOMContentLoaded', () => loading())

window.addEventListener('load', () => {
    removeLoading()
    document.body.style.overflow = 'auto'

})