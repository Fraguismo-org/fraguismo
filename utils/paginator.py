from django.core.paginator import Paginator, InvalidPage, EmptyPage

def pagina_lista(request: any, lista: list, paginas: int = 25) -> any:
    paginas = Paginator(lista, paginas)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1
    try:
        return paginas.page(page)
    except (EmptyPage, InvalidPage):
        return paginas.page(paginas.num_pages)
    